from bs4 import BeautifulSoup





def get_inner_text_from_html():
    soup = BeautifulSoup(html_content, "html.parser")
    inner_text = soup.get_text()
    print(inner_text)

