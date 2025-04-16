import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <Link className="navbar-brand" href="/">Admin</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" href="/">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/users">Users</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
