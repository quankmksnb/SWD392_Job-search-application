"use client"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from 'react'
import axios from 'axios';
import '../../select.scss'
const UpdateJob = () => {
    const data = {
        company_id: "", category_id: "", title: "", description: "", requirements: "", salary_min: "",
        salary_max: "", location: "", job_type: "Full-time", experience_level: "Mid-level", number_of_positions: 1, status: "active",
        deadline: "2024-12-31", required_skills: ""
    }
    const router = useRouter()
    const params = useParams();
    const job_id = params.id

    const [dataJob, setDataJob] = useState(data)
    const [jobPosts, setJobPosts] = useState([])
    const [cateName, setCateName] = useState([])
    const [compName, setCompName] = useState([])
    const [selectSkill, setSelectSkill] = useState([])

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const fetchJobList = async () => {
                    const response = await axios.get('http://localhost:9999/job/job-list');
                    setJobPosts(response.data.data || []);
                };

                const fetchJobDetail = async () => {
                    if (job_id) {
                        const response = await axios.get('http://localhost:9999/job/job-list');
                        const allJobs = response.data.data || [];
                        const jobData = allJobs.find(job => job.id == job_id);
                        if (jobData) {
                            setDataJob({
                                company_id: jobData.company_id || "",
                                category_id: jobData.category_id || "",
                                title: jobData.title || "",
                                description: jobData.description || "",
                                requirements: jobData.requirements || "",
                                salary_min: jobData.salary_min || "",
                                salary_max: jobData.salary_max || "",
                                location: jobData.location || "",
                                job_type: jobData.job_type || "Full-time",
                                experience_level: jobData.experience_level || "Mid-level",
                                number_of_positions: jobData.number_of_positions || 1,
                                status: jobData.status || "active",
                                deadline: jobData.deadline || "",
                                required_skills: jobData.required_skills || ""
                            });

                            if (jobData.required_skills) {
                                const skillArray = jobData.required_skills.split(', ').map(skill => skill.trim());
                                setSelectSkill(skillArray);
                            }
                        }
                    }
                };

                const fechCategoryName = async () => {
                    const response = await axios.get('http://localhost:9999/job/category-name');
                    setCateName(response.data.data || []);
                };

                const fechCompanyName = async () => {
                    const response = await axios.get('http://localhost:9999/job/company-name');
                    setCompName(response.data.data || []);
                };

                await Promise.all([
                    fetchJobList(),
                    fetchJobDetail(),
                    fechCategoryName(),
                    fechCompanyName()
                ]);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchAllData();
    }, [job_id]);

    const skillList = [...new Set(
        (jobPosts || []).map(job => job.required_skills || "")
            .flatMap(item => item.split(', ').map(skill => skill.trim()))
            .filter(skill => skill !== "")
    )];

    const experienceLevel = [...new Set(
        (jobPosts || []).map(job => job.experience_level).filter(Boolean)
    )];

    const typeJob = [...new Set(
        (jobPosts || []).map(job => job.job_type).filter(Boolean)
    )];

    const formatDate = (dateTime) => {
        const date = new Date(dateTime)
        const day = String(date.getDay()).padStart(2, '0')
        const month = String(date.getMonth()).padStart(2, '0')
        const years = String(date.getFullYear())
        return `${day}-${month}-${years}`
    }

    const handleChange = (e) => {
        const { name, value, type } = e.target
        const numberFields = ['salary_min', 'salary_max', 'number_of_positions', 'company_id', 'category_id'];
        if (numberFields.includes(name)) {
            setDataJob(prev => ({
                ...prev,
                [name]: value === '' ? '' : Number(value)
            }))
        } else {
            setDataJob(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleSkillChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions)
            .map(option => option.value);
        setSelectSkill(selectedOptions);

        setDataJob(prev => ({
            ...prev,
            required_skills: selectedOptions.join(', ')
        }))
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dataJob.company_id || !dataJob.category_id) {
            alert('Vui lòng chọn Company, Category');
            return;
        }

        try {
            let mysqlDeadline = '2024-12-31';
            if (dataJob.deadline) {
                if (dataJob.deadline.includes('T')) {
                    mysqlDeadline = dataJob.deadline.split('T')[0];
                } else {
                    mysqlDeadline = dataJob.deadline;
                }
            }

            const submitData = {
                company_id: Number(dataJob.company_id),
                category_id: Number(dataJob.category_id),
                title: dataJob.title,
                description: dataJob.description || '',
                requirements: dataJob.requirements || '',
                salary_min: Number(dataJob.salary_min) || 0,
                salary_max: Number(dataJob.salary_max) || 0,
                location: dataJob.location || '',
                job_type: dataJob.job_type,
                experience_level: dataJob.experience_level,
                number_of_positions: Number(dataJob.number_of_positions) || 1,
                status: dataJob.status,
                deadline: mysqlDeadline,
                required_skills: dataJob.required_skills || ''
            };

            const response = await axios.put(`http://localhost:9999/job/update-job/${job_id}`, submitData);

            if (response.data.success) {
                alert('Job updated successfully!');
                router.push("/job/job-list");
            }
        } catch (error) {
            alert('Failed to update job: ' +
                (error.response?.data?.error || error.response?.data?.message || 'Unknown error'));
        }
    }
    return (
        <div className="p-10">
            <div className="flex items-center justify-between p-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">UPDATE RECRUITMENT POST</h2>
                <button className="flex items-center gap-2 px-3 py-1 text-blue-700 hover:text-blue-600 transition"
                    onClick={() => router.push("/job/job-list")}>Back
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-4">
                    <div className="bg-white p-6  shadow-md col-span-8 ">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Basic information
                        </h2>
                        <div>
                            <div className=" mb-2">
                                <label className="block text-gray-700 font-medium m-2">Title</label>
                                <input type="text" placeholder="Enter Title" name="title"
                                    value={dataJob.title} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 " />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium m-2">Company</label>
                                    <select name="company_id" value={dataJob.company_id} onChange={handleChange}
                                        className="input-container w-full" required>
                                        <option value="" disabled>-- Select Company --</option>
                                        {compName.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div >
                                    <label className="block text-gray-700 font-medium m-2">Category</label>
                                    <select name="category_id" value={dataJob.category_id} onChange={handleChange}
                                        className="input-container w-full" required>
                                        <option value="" disabled>-- Select Category --</option>
                                        {cateName.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div >
                                    <label className="block text-gray-700 font-medium m-2">Level of experience</label>
                                    <select value={dataJob.experience_level} name="experience_level" onChange={handleChange}
                                        placeholder="Select Level" className="input-container w-full" required>
                                        <option value="" disabled>-- Select Level of experience --</option>
                                        {experienceLevel.map((ex, index) => (<option key={index}>{ex}</option>))}
                                    </select>
                                </div>
                                <div >
                                    <label className="block text-gray-700 font-medium m-2">Type of Job</label>
                                    <select value={dataJob.job_type} name="job_type" onChange={handleChange}
                                        placeholder="Select Type" className="input-container w-full" required>
                                        <option value="" disabled>-- Select Type of Job --</option>
                                        {typeJob.map((type, index) => (<option key={index}>{type}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium m-2">Description</label>
                                <textarea name="description" value={dataJob.description}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-6"
                                    placeholder="Enter Description" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium m-2">Requirement</label>
                                <textarea name="requirements" value={dataJob.requirements}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-6"
                                    placeholder="Enter Requirement" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-md col-span-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Salary & Location</h2>
                        <div >
                            <label className="block text-gray-700 font-medium m-2">Skill</label>
                            <select value={selectSkill} multiple name="required-skill" onChange={handleSkillChange}
                                placeholder="Select Type" className="input-container w-full" required>
                                {skillList.map((skill, index) => (<option key={index}>{skill}</option>))}
                            </select>
                        </div>
                        <div className="mt-2">
                            <label className="block text-gray-700 font-medium mb-2">Salary</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <input type='number' name="salary_min" value={dataJob.salary_min}
                                        className="input-container w-full" placeholder="Min" onChange={handleChange} />
                                </div>
                                <span className="text-gray-500">-</span>
                                <div className="flex-1">
                                    <input type='number' name="salary_max" value={dataJob.salary_max}
                                        className="input-container w-full" placeholder="Max" onChange={handleChange} />
                                </div>
                                <span className="text-gray-700 font-medium">VND</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <label className="block text-gray-700 font-medium mb-2">Location</label>
                            <input type="text" name="location" value={dataJob.location}
                                placeholder="Enter location" onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                        <div className="mt-2">
                            <label className="block text-gray-700 font-medium mb-2">Deadline</label>
                            <input
                                type="date" name="deadline" value={dataJob.deadline ? dataJob.deadline.split('T')[0] : ''}
                                onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-4 m-4">
                    <button
                        type="button" onClick={() => router.push('/job/job-list')}
                        className="mr-10 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    > Cancel </button>
                    <button
                        type="submit"
                        className="ms-10 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    > Save </button>
                </div>
            </form>

        </div>
    )
}
export default UpdateJob