import { useSelector } from "react-redux";

function Header() {
    const username = useSelector((state)=> state.user.user.name);
    const firstName = username?.split(" ")[0];
    return (
        <header className="w-[100vw] bg-gradient-to-r from-slate-200 via-gray-300 to-slate-200 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold tracking-wide">Demo Company</h1>
            <h1 className="text-lg font-semibold">{firstName}</h1>
        </header>
    );
}

export default Header;
