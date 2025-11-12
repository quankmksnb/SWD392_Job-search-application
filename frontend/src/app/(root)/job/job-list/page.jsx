"use client"
import { useRouter, useParams } from "next/navigation"
import FilterCard from '../../../../components/ui/FilterCard';
import { useState, useEffect } from 'react'
import axios from 'axios';

const ViewJob = () => {
    const router = useRouter()
    const { id } = useParams();
    const [jobPosts, setJobPosts] = useState([])
    const [cateName, setCateName] = useState([])
    const [compName, setCompName] = useState([])
    const [selectCategory, setSelectCategory] = useState("All Category")
    const [selectCompany, setSelectCompany] = useState("All Company")
    const [selectType, setSelectType] = useState("All Type")
    const [searchTitle, setSearchTitle] = useState("")
    const [currentUser, setCurrentUser] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const getUserFromStorage = () => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const userData = JSON.parse(stored);
                return userData.user || userData;
            }
            return null;
        } catch (err) {
            console.error(err);
            return null;
        }
    };
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const user = getUserFromStorage();
                if (!user) {
                    return;
                }
                const isHR = user.role_id === 2;
                if (!isHR) {
                    router.push('/');
                    return;
                }
                setCurrentUser(user);
                const [categoriesRes, companiesRes, jobListRes] = await Promise.all([
                    axios.get('http://localhost:9999/job/category-name'),
                    axios.get('http://localhost:9999/job/company-name', {
                        params: { userId: user.id }
                    }),
                    axios.get('http://localhost:9999/job/job-list', {
                        params: { userId: user.id },
                        timeout: 10000
                    })
                ]);

                if (categoriesRes.data.success) {
                    setCateName(categoriesRes.data.data);
                }

                if (companiesRes.data.success) {
                    setCompName(companiesRes.data.data);
                }

                if (jobListRes.data.success) {
                    setJobPosts(jobListRes.data.data);
                }

            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchJob();
    }, [router]);


    const uniCategory = ["All Category", ... new Set(cateName.map(job => job.name))]
    const uniCompany = ["All Company", ... new Set(jobPosts.map(job => job.company_name))]
    const uniJobType = ["All Type", ...new Set(jobPosts.map(job => job.job_type))]

    const filterJob = jobPosts.filter(job => {
        const category = selectCategory === "All Category" || selectCategory === job.category_name
        const company = selectCompany === "All Company" || selectCompany === job.company_name
        const type = selectType === "All Type" || selectType === job.job_type
        const title = job.title.toLowerCase().includes(searchTitle.toLowerCase())
        return category && type && company && title
    })
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentJobs = filterJob.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filterJob.length / itemsPerPage);

    const formatDate = (dateTime) => {
        if (!dateTime) return '';
        return dateTime.substring(0, 10); // chỉ lấy yyyy-mm-dd
    };


    return (
        <div>
            <div className="mb-4">
                <div>
                    <div className="flex justify-between items-center mb-6 p-4 shadow-lg">
                        <h2 className="text-2xl font-bold">LIST OF JOB POSTINGS</h2>
                        <div className="flex gap-3">
                            <input type="text" value={searchTitle} onChange={e => setSearchTitle(e.target.value)}
                                placeholder="Search by title"
                                className="px-4 py-2 border border-gray-300 rounded-lg" />
                            <button className="bg-blue-500 text-white py-2 px-3 rounded"
                                onClick={() => router.push('/job/create-job')}> Post a job
                            </button>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-1/6">
                            <div className="space-y-6 rounded-lg shadow p-1">
                                <FilterCard title="CATEGORIES" items={uniCategory}
                                    selectedItem={selectCategory} onItemSelect={setSelectCategory} />
                                <FilterCard title="TYPE OF JOB" items={uniJobType}
                                    selectedItem={selectType} onItemSelect={setSelectType} />
                                <FilterCard title="COMPANY" items={uniCompany}
                                    selectedItem={selectCompany} onItemSelect={setSelectCompany} />
                            </div>
                        </div>
                        <div className="px-4 w-5/6 ">
                            <div className="overflow-hidden rounded-sm border border-gray-200">
                                <table className="min-w-full text-left ">
                                    <thead className="bg-blue-500 text-white text-center font-semibold">
                                        <tr>
                                            <th className="p-3 w-40">Title</th>
                                            <th className="p-3 w-40">Company</th>
                                            <th className="p-3 w-30">Job Type</th>
                                            <th className="p-3 w-30">Level</th>
                                            <th className="p-3 w-30">Deadline</th>
                                            <th className="p-3">Salary</th>
                                            <th className="w-30">Number of Positions</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {(filterJob ? filterJob : jobPosts).map(job => ( */}
                                        {currentJobs.map(job => (
                                            <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-center">
                                                <td className="p-3">{job.title}</td>
                                                <td className="p-3">{job.company_name}</td>
                                                <td className="p-3">{job.job_type}</td>
                                                <td className="p-3">{job.experience_level}</td>
                                                <td className="p-3">{formatDate(job.deadline)}</td>
                                                {/* <td className="p-3">{job.salary_min} - {job.salary_max}</td> */}
                                                <td className="p-3">
                                                    {(parseFloat(job.salary_min) * 1000).toLocaleString("en-US")} -{" "}
                                                    {(parseFloat(job.salary_max) * 1000).toLocaleString("en-US")}
                                                </td>


                                                <td className="p-3">{job.number_of_positions}</td>
                                                <td className="p-3">{job.status}</td>
                                                <td className="p-3">
                                                    <button className="bg-blue-500 text-white py-1 px-3 rounded m-2"
                                                        onClick={() => router.push(`/job/update-job/${job.id}`)}>  Edit
                                                    </button>
                                                    <button className="bg-red-500 text-white py-1 px-3 rounded"
                                                        onClick={() => router.push(`/job/delete-job/${job.id}`)}> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div >
                        </div >
                    </div>

                    <div className="flex justify-center items-center mt-4 gap-2">
                        <button
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default ViewJob