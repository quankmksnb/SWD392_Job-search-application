"use client"
import { useRouter, useParams } from "next/navigation"
import FilterCard from '../../../../components/ui/FilterCard';
import { useState, useEffect } from 'react'
import axios from 'axios';
const ViewJob = () => {
    const router = useRouter()
    const { id } = useParams();
    const [jobPosts, setJobPosts] = useState([])
    const [selectCategory, setSelectCategory] = useState("All Category")
    const [selectCompany, setSelectCompany] = useState("All Company")
    const [selectType, setSelectType] = useState("All Type")
    const [searchTitle, setSearchTitle] = useState("")

    useEffect(() => {
        const fetchJob = async () => {
            await axios.get('http://localhost:9999/job/job-list')
                .then(res => setJobPosts(res.data.data))
                .catch(err => console.error(err))
        }
        fetchJob();
    }, [])

    const formatDate = (dateTime) => {
        if (!dateTime) return '';
        return dateTime.split('T')[0];
    }

    const uniCategory = ["All Category", ... new Set(jobPosts.map(job => job.category_name))]
    const uniCompany = ["All Company", ... new Set(jobPosts.map(job => job.company_name))]
    const uniJobType = ["All Type", ...new Set(jobPosts.map(job => job.job_type))]

    const filterJob = jobPosts.filter(job => {
        const category = selectCategory === "All Category" || selectCategory === job.category_name
        const company = selectCompany === "All Company" || selectCompany === job.company_name
        const type = selectType === "All Type" || selectType === job.job_type
        const title = job.title.toLowerCase().includes(searchTitle.toLowerCase())
        return category && type && company && title
    })
    return (
        <div>
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center w-1/3">LIST OF JOB POSTINGS</h2>
                <div className="flex items-center gap-3 w-2/3 justify-end">
                    <input type="text" value={searchTitle} onChange={e => setSearchTitle(e.target.value)}
                        placeholder="Search by title" className="input-container w-1/3" />
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded mr-2 transition-colors"
                        onClick={() => router.push('/job/create-job')}> Create
                    </button>
                </div>
            </div>
            <div className="flex">
                <div className="w-1/6 mt-4">
                    <div className="space-y-6">
                        <FilterCard title="CATEGORIES" items={uniCategory}
                            selectedItem={selectCategory} onItemSelect={setSelectCategory} />
                        <FilterCard title="TYPE OF JOB" items={uniJobType}
                            selectedItem={selectType} onItemSelect={setSelectType} />
                        <FilterCard title="COMPANY" items={uniCompany}
                            selectedItem={selectCompany} onItemSelect={setSelectCompany} />
                    </div>
                </div>
                <div className="px-4 mx-auto py-8 w-5/6">
                    <div>
                        <table className="min-w-full bg-white border-collapse">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="p-3 w-40 text-left font-semibold">Title</th>
                                    <th className="w-30 text-left font-semibold">Category</th>
                                    <th className="p-3 w-30 text-left font-semibold">Job Type</th>
                                    <th className="p-3 w-30 text-left font-semibold">Level</th>
                                    <th className="p-3 w-30 text-left font-semibold">Posting Date</th>
                                    <th className="p-3 w-30 text-left font-semibold">Deadline</th>
                                    <th className="p-3 text-left font-semibold">Salary</th>
                                    <th className="p-3 w-40 text-left font-semibold">Company</th>
                                    <th className="p-3 text-left font-semibold">Status</th>
                                    <th className="p-3 text-left font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {(filterJob ? filterJob : jobPosts).map(job => (
                                    <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="p-3">{job.title}</td>
                                        <td >{job.category_name}</td>
                                        <td className="p-3">{job.job_type}</td>
                                        <td className="p-3">{job.experience_level}</td>
                                        <td className="p-3">{formatDate(job.created_at)}</td>
                                        <td className="p-3">{formatDate(job.deadline)}</td>
                                        <td className="p-3">{job.salary_min} - {job.salary_max}</td>
                                        <td className="p-3">{job.company_name}</td>
                                        <td className="p-3">{job.status}</td>
                                        <td className="p-3">
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded m-2 transition-colors"
                                                onClick={() => router.push(`/job/update-job/${job.id}`)}>  Edit
                                            </button>
                                            <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded transition-colors"
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

        </div>

    )
}

export default ViewJob