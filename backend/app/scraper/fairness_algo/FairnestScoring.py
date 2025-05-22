import os 
from dotenv import load_dotenv
from supabase import create_client, Client
import pandas as pd
from statsmodels import robust

#Initialize Supabase client
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def run_fairnest_algo():
    #Fetch data
    def fetch_all_data(table_name, columns):
        all_data = []
        chunk_size = 1000
        start = 0

        while True:
            response = supabase.table(table_name).select(columns).range(start, start+ chunk_size - 1).execute()
            if not response.data:
                break
            all_data.extend(response.data)
            start += chunk_size
        
        return all_data

    def fetch_address_and_property_data():
        # Fetch all address data
        address_data = fetch_all_data(
            'address',
            'id, postal_code, locality, administrative_area, sub_administrative_area'
        )
        if not address_data:
            print("No address data found.")
            return pd.DataFrame()

        # Fetch all property listing data
        property_data = fetch_all_data(
            'property_listings',
            'address_id, price, square_feet, sale_status'
        )
        if not property_data:
            print("No property listing data found.")
            return pd.DataFrame()

        # Merge address and property data
        address_df = pd.DataFrame(address_data)
        property_df = pd.DataFrame(property_data)

        merged_df = pd.merge(address_df, property_df, left_on='id', right_on='address_id', how='inner')

        # Drop redundant columns
        merged_df = merged_df.drop(columns=['address_id'])

        # Calculate price per square foot
        merged_df['price_per_sqft'] = merged_df.apply(
            lambda row: row['price'] / row['square_feet'] if row['square_feet'] > 0 else None, axis=1
        )

        # Calculate medians for fallback
        zip_median = merged_df.groupby('postal_code')['price_per_sqft'].median()
        locality_median = merged_df.groupby('locality')['price_per_sqft'].median()
        sub_admin_median = merged_df.groupby('sub_administrative_area')['price_per_sqft'].median()
        global_median = merged_df['price_per_sqft'].median()

        # Fill missing price_per_sqft with fallback logic
        def fill_price_per_sqft(row):
            if pd.notnull(row['price_per_sqft']):
                return row['price_per_sqft']
            if pd.notnull(zip_median.get(row['postal_code'])):
                return zip_median[row['postal_code']]
            if pd.notnull(locality_median.get(row['locality'])):
                return locality_median[row['locality']]
            if pd.notnull(sub_admin_median.get(row['sub_administrative_area'])):
                return sub_admin_median[row['sub_administrative_area']]
            return global_median

        merged_df['price_per_sqft'] = merged_df.apply(fill_price_per_sqft, axis=1)
        merged_df = merged_df.sort_values(by="id", ascending=True)

        return merged_df

    result_df = fetch_address_and_property_data()
    # Precompute MADs for fallback logic
    zip_mads = result_df.groupby("postal_code")["price_per_sqft"].apply(robust.mad).to_dict()
    locality_mads = result_df.groupby("locality")["price_per_sqft"].apply(robust.mad).to_dict()
    sub_area_mads = result_df.groupby("sub_administrative_area")["price_per_sqft"].apply(robust.mad).to_dict()
    overall_mad = robust.mad(result_df["price_per_sqft"])

    # Precompute medians for fallback logic
    zip_medians = result_df.groupby("postal_code")["price_per_sqft"].median().to_dict()
    locality_medians = result_df.groupby("locality")["price_per_sqft"].median().to_dict()
    sub_area_medians = result_df.groupby("sub_administrative_area")["price_per_sqft"].median().to_dict()
    overall_median = result_df["price_per_sqft"].median()

    # Function to score fairness using MAD
    def score_fairness_mad(row):
        zip_code = row["postal_code"]
        locality = row["locality"]
        sub_area = row["sub_administrative_area"]
        ppsf = row["price_per_sqft"]

        # Median price per sqft (fallback logic)
        median_ppsf = zip_medians.get(zip_code)
        if pd.isna(median_ppsf):
            median_ppsf = locality_medians.get(locality)
        if pd.isna(median_ppsf):
            median_ppsf = sub_area_medians.get(sub_area)
        if pd.isna(median_ppsf):
            median_ppsf = overall_median

        # MAD per sqft (fallback logic)
        mad_ppsf = zip_mads.get(zip_code)
        if mad_ppsf is None or mad_ppsf == 0:
            mad_ppsf = locality_mads.get(locality)
        if mad_ppsf is None or mad_ppsf == 0:
            mad_ppsf = sub_area_mads.get(sub_area)
        if mad_ppsf is None or mad_ppsf == 0:
            mad_ppsf = overall_mad

        # Avoid division by zero or NaN
        if mad_ppsf == 0 or pd.isna(ppsf) or pd.isna(median_ppsf):
            return "Unknown"

        # Modified z-score using MAD
        modified_z = 0.6745 * (ppsf - median_ppsf) / mad_ppsf

        # Thresholding on modified z-score
        if modified_z < -0.4:
            return "good"
        elif -0.4 <= modified_z <= 0.4:
            return "fair"
        else:
            return "bad"

    # Apply the function to the DataFrame
    result_df["fairness_rating"] = result_df.apply(score_fairness_mad, axis=1)
    fairness_df = result_df.rename(columns={"id": "address_id"})[["address_id", "price", "sale_status", "fairness_rating"]]

    # def update_fairness_rating(batch_size=100):
    #     # Split the DataFrame into smaller batches
    #     for start in range(0, len(fairness_df), batch_size):
    #         batch = fairness_df.iloc[start:start + batch_size]
    #         updates = []

    #         for _, row in batch.iterrows():
    #             updates.append({
    #                 'address_id': int(row['address_id']),  # Convert to native Python int
    #                 'fairness_rating': row['fairness_rating'],
    #                 'price': int(result_df.loc[result_df['id'] == row['address_id'], 'price'].values[0]),  # Convert to native Python int
    #                 'sale_status': result_df.loc[result_df['id'] == row['address_id'], 'sale_status'].values[0],  # Ensure sale_status is included
    #                 'fairness_rating_updated_at': pd.Timestamp.now().isoformat()
    #             })

    #         # Perform batch updates
    #         response = supabase.table('property_listings').upsert(updates, on_conflict='address_id').execute()

    #         if response.data is not None:
    #             print(f"Successfully updated fairness_rating for batch starting at index {start}")
    #         else:
    #             print(f"Failed to update fairness_rating for batch starting at index {start}: {response.errors}")

    def update_fairness_rating(batch_size=100):
        for start in range(0, len(fairness_df), batch_size):
            batch = fairness_df.iloc[start:start + batch_size]
            payloads = []

            for _, row in batch.iterrows():
                try:
                    address_id = int(row['address_id'])
                    fairness_rating = row['fairness_rating']

                    # Match against result_df to get price and sale_status
                    match_row = result_df[result_df['id'] == address_id]
                    if match_row.empty:
                        print(f"⚠️ Skipping: address_id {address_id} not found in result_df")
                        continue

                    price = int(match_row['price'].values[0])
                    sale_status = match_row['sale_status'].values[0]

                    payloads.append({
                        'address_id': address_id,
                        'price': price,
                        'sale_status': sale_status,
                        'fairness_rating': fairness_rating,
                        'fairness_rating_updated_at': pd.Timestamp.now().isoformat()
                    })

                except Exception as e:
                    print(f"❌ Failed to prepare row for address_id {row['address_id']}: {e}")

            # Perform batched upsert
            if payloads:
                try:
                    response = supabase.table('property_listings')\
                        .upsert(payloads, on_conflict='address_id,price,sale_status')\
                        .execute()

                    if response.data:
                        print(f"✅ Updated {len(response.data)} rows in batch starting at index {start}")
                    else:
                        print(f"⚠️ No rows matched for batch starting at index {start}")
                except Exception as e:
                    print(f"❌ Failed to upsert batch starting at index {start}: {e}")
    
    update_fairness_rating()


if __name__ == "__main__":
    run_fairnest_algo()