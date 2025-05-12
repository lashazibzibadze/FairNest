import Navbar from "../components/navbar/Navbar";

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
        <Navbar />
        <main className="pt-24">{children}</main>
      </>
    );
}
