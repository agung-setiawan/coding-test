import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import getUserFetch from '../services/users';
import { getUserDeals, getUserTotalDeals, getUserTotalDealsByStatus, getTotalDealsByStatus } from "../services/deals";
import getUserClients from "../services/clients";
import SalesChart from '../components/SalesChart';
import DealsChart from '../components/DealsChart';
import TotalByStatus from "../components/TotalByStatus";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [userDeals, setUserDeals] = useState({}); // { userId: [deals] }
    const [userClients, setUserClients] = useState({}); // { userId: [deals] }
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [salesDeals, setSalesDeals] = useState();
    const [totalDeals, setTotalDeals] = useState();
    const [totalDealsByStatus, setTotalDealsByStatus] = useState();

    useEffect(() => {
        const controller = new AbortController(); // For timeout control
        if (!loading) return;

        const timeout = setTimeout(() => {
            controller.abort(); // Force abort after delay
            setErrorMessage('Request timed out. Please try again.');
            setShowError(true);
            setLoading(false);
        }, 5000);

        const loadUsers = async () => {
            try {
                const data = await getUserFetch()

                if(data)
                {
                    const totalDeals = await getUserTotalDeals();

                    const usersWithDeals = data.map(user => ({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        dealValue: totalDeals[user.name],
                    }));

                    const totalSalesDeals = await getUserTotalDealsByStatus();

                    const dealsByStatus = Object.entries(totalSalesDeals).map(([rep, deals]) => ({
                        rep,
                        'Closed Won': deals['Closed Won'] || 0,
                        'In Progress': deals['In Progress'] || 0,
                        'Closed Lost': deals['Closed Lost'] || 0,
                    }));

                    const totalByDealStatus = await getTotalDealsByStatus();

                    const outputData = totalByDealStatus.map(item => ({
                        name: item.name,
                        value: Number(item.value)
                    }));

                    setUsers(data)
                    setSalesDeals(usersWithDeals);
                    setTotalDeals(dealsByStatus);
                    setTotalDealsByStatus(outputData);
                    clearTimeout(timeout)
                    setLoading(false)
                }
            } catch (err) {
                if (err.name === 'CanceledError' || err.name === 'AbortError') {
                    return;
                }
                clearTimeout(timeout);
                setErrorMessage('Failed to load users. Please check your connection or try again later.');
                setShowError(true);
                setLoading(false);
            }
        };

        loadUsers();

        return () => {
            controller.abort(); // Clean up on unmount
            clearTimeout(timeout);
        };
    }, [loading]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.role.toLowerCase().includes(term) ||
            user.region.toLowerCase().includes(term) ||
            user.skills.join('').toLowerCase().includes(term)
        );
        setUsers(filtered);
    };

    const handleReset = async () => {
        setSearchTerm('');
        setLoading(true)

        const data = await getUserFetch()
        if(data)
        {
            setUsers(data)
            setLoading(false)
        }
    }

    const handleDealsList= async (userId) => {
        setUserClients({});
        if (expandedUserId === userId) {
            setExpandedUserId(null); // Collapse
            return;
        }

        if (!userDeals[userId]) {
            const deals = await getUserDeals(userId);
            setUserDeals((prev) => ({ ...prev, [userId]: deals }));
        }

        setExpandedUserId(userId);
    };

    const handleClientsList = async (userId) => {
        setUserDeals({})
        if (expandedUserId === userId) {
            setExpandedUserId(null); // Collapse
            setLoading(false)
            return;
        } else {
            setLoading(true)
        }

        if (!userClients[userId]) {
            const clients = await getUserClients(userId);
            setUserClients((prev) => ({ ...prev, [userId]: clients }));
            setLoading(false)
        }

        setExpandedUserId(userId);
    };

    return (
        <Layout>
            {loading && (
                <div className="loading-mask">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <SalesChart data={salesDeals} />
                    </div>
                    <div className="col-lg-4">
                        <DealsChart data={totalDeals} />
                    </div>
                    <div className="col-lg-4">
                        <TotalByStatus data={totalDealsByStatus} />
                    </div>
                </div>
                <h4 className="mb-4 mt-4">User List</h4>
                <div className="mb-3">
                    <div className="row-cols-auto">
                        <div className="col-lg-12 d-flex align-items-center">
                            <input
                                type="text"
                                className="form-control mr-2"
                                placeholder="Search by name, role, region, or skills..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />&nbsp;
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Region</th>
                        <th>Skills</th>
                        <th><div className="text-center">Clients</div></th>
                        <th><div className="text-center">Deals</div></th>
                    </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <>
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.role}</td>
                                    <td>{user.region}</td>
                                    <td>{user.skills.join(", ") }</td>
                                    <td>
                                        <div className="text-center">
                                            <button
                                                className="btn btn-link p-0"
                                                onClick={() => handleClientsList(user.id)}
                                            >
                                                List of Clients
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-center">
                                            <button
                                                className="btn btn-link p-0"
                                                onClick={() => handleDealsList(user.id)}
                                            >
                                                List of Deals
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedUserId === user.id && (
                                    <tr>
                                        <td colSpan="7">
                                            {userDeals[user.id]?.length > 0 ? (
                                                <>
                                                    <h6>Deal List</h6>
                                                    <table className="table table-sm table-bordered mt-2">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Name</th>
                                                                <th><div className="text-center">Value</div></th>
                                                                <th><div className="text-center">Status</div></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        {userDeals[user.id].map((deal) => (
                                                            <tr key={user.id}>
                                                                <td>{deal.client}</td>
                                                                <td><div className="text-right">$ {deal.value}</div></td>
                                                                <td><div className="text-center">{deal.status}</div></td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </>
                                            ) : ( <></> )}

                                            {userClients[user.id]?.length > 0 ? (
                                                <>
                                                    <h6>Client List</h6>
                                                    <table className="table table-sm table-bordered mt-2">
                                                    <thead className="table-light">
                                                    <tr>
                                                        <th>Name</th>
                                                        <th><div className="text-center">Industry</div></th>
                                                        <th><div className="text-center">Contact Person</div></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {userClients[user.id].map((clients) => (
                                                            <tr key={user.id}>
                                                                <td>{clients.name}</td>
                                                                <td><div className="text-left">{clients.industry}</div></td>
                                                                <td><div className="text-left">{clients.contact}</div></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                </>
                                            ) : ( <></> )}
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {showError && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">Error</h5>
                                <button type="button" className="btn-close" onClick={() => setShowError(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>{errorMessage}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowError(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}