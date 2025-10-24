"use client"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from 'react'
import axios from 'axios';
import '../select.scss'
const ViewJob = () => {
    const router = useRouter()
    const { id } = useParams();
    const [jobPosts, setJobPosts] = useState([])
    const [selectCategory, setSelectCategory] = useState("All Category")
    const [selectCompany, setSelectCompany] = useState("All Company")
    const [selectLevel, setSelectLevel] = useState("All Level")
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
        const date = new Date(dateTime)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = String(date.getFullYear())
        return `${year}-${month}-${day}`
    }

    const uniCategory = ["All Category", ... new Set(jobPosts.map(job => job.category_name))]
    const uniCompany = ["All Company", ... new Set(jobPosts.map(job => job.company_name))]
    const uniJobType = ["All Type", ...new Set(jobPosts.map(job => job.job_type))]
    const uniLevel = ["All Level", ...new Set(jobPosts.map(job => job.experience_level))]

    const filterJob = jobPosts.filter(job => {
        const category = selectCategory === "All Category" || selectCategory === job.category_name
        const company = selectCompany === "All Company" || selectCompany === job.company_name
        const type = selectType === "All Type" || selectType === job.job_type
        const level = selectLevel === "All Level" || selectLevel === job.experience_level
        const title = job.title.toLowerCase().includes(searchTitle.toLowerCase())
        return category && type && company && level && title
    })
    return (
        <div className="px-4 mx-auto py-8">
            <div className="flex items-center justify-between p-4 mb-4 gap-4">
                <select className="input-container"
                    value={selectCategory} onChange={e => setSelectCategory(e.target.value)} placeholder="Select Category" >
                    {uniCategory.map(cate => (<option key={cate} value={cate}>{cate}</option>))}
                </select>
                <select className="input-container"
                    value={selectCompany} onChange={e => setSelectCompany(e.target.value)} placeholder="Select Company" >
                    {uniCompany.map((c, index) => (<option key={index}>{c}</option>))}
                </select>
                <select className="input-container"
                    value={selectLevel} onChange={e => setSelectLevel(e.target.value)} placeholder="Select Level" >
                    {uniLevel.map(l => (<option key={l}>{l}</option>))}
                </select>
                <select className="input-container"
                    value={selectType} onChange={e => setSelectType(e.target.value)} placeholder="Select Type" >
                    {uniJobType.map(type => (<option key={type}>{type}</option>))}
                </select>

                <input type="text" value={searchTitle} onChange={e => setSearchTitle(e.target.value)}
                    placeholder="Search by title" className="input-container w-1/3"
                />
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded mr-2 transition-colors"
                    onClick={() => router.push('/job/create-job')}> Create
                </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">LIST OF JOB POSTINGS</h2>
            <div>
                <table className="min-w-full bg-white border-collapse">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left font-semibold">Title</th>
                            <th className="py-3 px-4 text-left font-semibold">Category</th>
                            <th className="py-3 px-4 text-left font-semibold">Job Type</th>
                            <th className="py-3 px-4 text-left font-semibold">Level</th>
                            <th className="py-3 px-4 text-left font-semibold">Posting Date</th>
                            <th className="py-3 px-4 text-left font-semibold">Deadline</th>
                            <th className="py-3 px-4 text-left font-semibold">Salary</th>
                            <th className="py-3 px-4 text-left font-semibold">Company</th>
                            <th className="py-3 px-4 text-left font-semibold">Status</th>
                            <th className="py-3 px-4 text-left font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {(filterJob ? filterJob : jobPosts).map(job => (
                            <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4">{job.title}</td>
                                <td className="py-3 px-4">{job.category_name}</td>
                                <td className="py-3 px-4">{job.job_type}</td>
                                <td className="py-3 px-4">{job.experience_level}</td>
                                <td className="py-3 px-4">{formatDate(job.created_at)}</td>
                                <td className="py-3 px-4">{formatDate(job.deadline)}</td>
                                <td className="py-3 px-4">{job.salary_min} - {job.salary_max}</td>
                                <td className="py-3 px-4">{job.company_name}</td>
                                <td className="py-3 px-4">{job.status}</td>
                                <td className="py-3 px-4">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded mr-2 transition-colors"
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
    )
}

export default ViewJob