"use client"
import { useRouter } from "next/navigation"
import InputCustom from './../../../../components/ui/InputCustom/InputCustom';
import { useState, useEffect } from 'react'
import axios from 'axios';

const NewJob = () => {
    const data = {
        company_id: "", category_id: "", title: "", description: "", requirements: "", salary_min: "", salary_max: "", location: "",
        job_type: "", experience_level: "Mid-level", number_of_positions: 1, status: "published", deadline: "2024-12-31", required_skills: ""
    }
    const router = useRouter()
    const [dataJob, setDataJob] = useState(data)
    const [jobPosts, setJobPosts] = useState([])
    const [cateName, setCateName] = useState([])
    const [compName, setCompName] = useState([])
    const [selectSkill, setSelectSkill] = useState([])
    const [selectStatus, setSelectStatus] = useState('published')
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const getUserFromStorage = () => {
                    try {
                        const stored = localStorage.getItem("user");
                        if (stored) {
                            const userData = JSON.parse(stored);
                            return userData.user || userData;
                        }
                        return null;
                    } catch (err) {
                        console.error("Error parsing user:", err);
                        return null;
                    }
                };

                const user = getUserFromStorage();
                if (!user || !user.id) {
                    return;
                }
                const [categoriesRes, companiesRes, jobListRes] = await Promise.all([
                    axios.get('http://localhost:9999/job/category-name'),
                    axios.get('http://localhost:9999/job/company-name', {
                        params: { userId: user.id }
                    }),
                    axios.get(`http://localhost:9999/job/job-list`)
                ]);

                if (categoriesRes.data.success) {
                    setCateName(categoriesRes.data.data);
                } else {
                    console.error("Failed to fetch categories:", categoriesRes.data.message);
                }

                if (companiesRes.data.success) {
                    setCompName(companiesRes.data.data);
                } else {
                    console.error("Failed to fetch companies:", companiesRes.data.message);
                }
                if (jobListRes.data.success) {
                    setJobPosts(jobListRes.data.data);
                } else {
                    console.error("Failed to fetch job list:", jobListRes.data.message);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchJob();
    }, []);

    const uniCategory = [...new Map(cateName.map(category => [category.id, category])).values()];
    const uniCompany = [...new Map(compName.map(company => [company.id, company])).values()];
    const skillList = [...new Set((jobPosts || [])
        .map(job => job.required_skills || '')
        .flatMap(item => item.split(',').map(skill => skill.trim()))
        .filter(skill => skill !== ''))];

    const experienceLevel = [...new Set(jobPosts.map(job => job.experience_level))]

    const typeJob = [...new Set(jobPosts.map(job => job.job_type))]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataJob(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (e) => {
        setSelectStatus(e.target.value);
        setDataJob(prev => ({ ...prev, status: e.target.value }));
    };
    const handleSkillChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setSelectSkill(selectedOptions);
        setDataJob(prev => ({ ...prev, required_skills: selectedOptions.join(', ') }))
    };
    // Format salary input: hiển thị có dấu phẩy ngăn cách hàng nghìn
    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        const raw = value.replace(/,/g, ''); // loại bỏ dấu phẩy cũ

        // Chỉ cho nhập số
        if (!/^\d*$/.test(raw)) return;

        // Format hiển thị (ví dụ: 12000 -> 12,000)
        const formatted = raw ? Number(raw).toLocaleString('en-US') : '';

        setDataJob((prev) => ({ ...prev, [name]: formatted }));
    };


    const handleSubmit = async () => {
        const currentUser = JSON.parse(localStorage.getItem("user"))
        const userData = currentUser.user || currentUser
        const { title, description, requirements, required_skills, location, company_id, category_id } = dataJob;

        if (!title || !description || !requirements || !required_skills || !location || !company_id || !category_id) {
            alert('Please enter complete information');
            return;
        }

        if (dataJob.salary_min && dataJob.salary_min <= 0) {
            alert('Salary min must be greater than 0');
            return;
        }

        if (dataJob.salary_max && dataJob.salary_max <= 0) {
            alert('Salary max must be greater than 0');
            return;
        }

        if (dataJob.salary_min && dataJob.salary_max && dataJob.salary_min >= dataJob.salary_max) {
            alert('Salary max must be greater than salary min');
            return;
        }

        try {
            const response = await axios.post('http://localhost:9999/job/create-job',
                {
                    ...dataJob,
                    salary_min: Number(dataJob.salary_min),
                    salary_max: Number(dataJob.salary_max),
                    number_of_positions: Number(dataJob.number_of_positions),
                    status: selectStatus,
                    created_by: userData.id
                }
            );

            if (response.data.success) {
                alert('Job created successfully!');
                router.push("/job/job-list");
            } else {
                alert('Error: ' + response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Error: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-10 bg-[#CDE5F1]">
            <div className="flex justify-between mb-6 p-4 bg-[white] rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">CREATE NEW RECRUITMENT POST</h2>
                <button className="gap-2 py-2 px-4 bg-gray-100 rounded-lg border border-gray-300"
                    onClick={() => router.push("/job/job-list")}>Back
                </button>
            </div>
            <div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="bg-white p-6 shadow-md col-span-8 rounded-lg">
                        <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">
                            Basic information
                        </h2>
                        <div>
                            <div className="mb-2">
                                <label className="block text-gray-700 font-medium m-2">
                                    Title<strong className="text-red-500"> *</strong>
                                </label>
                                <InputCustom type="text" name="title" placeholder="Enter Title"
                                    value={dataJob.title} onChange={handleChange} required={true} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block m-2">
                                        Company<strong className="text-red-500"> *</strong>
                                    </label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        value={dataJob.company_id}
                                        onChange={(e) => handleChange({ target: { name: 'company_id', value: e.target.value } })} >
                                        <option value="" disabled>-- Select Company --</option>
                                        {uniCompany.map((c, index) => (
                                            <option key={index} value={c.id} >{c.name}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block m-2">
                                        Category<strong className="text-red-500"> *</strong>
                                    </label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={dataJob.category_id}
                                        onChange={(e) => handleChange({ target: { name: 'category_id', value: e.target.value } })}>
                                        <option value="" disabled>-- Select Category --</option>
                                        {uniCategory.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>))}
                                    </select>

                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block m-2">Level of experience</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={dataJob.experience_level}
                                        onChange={(e) => handleChange({ target: { name: 'experience_level', value: e.target.value } })}>
                                        <option value="" disabled>-- Select Level of experience --</option>
                                        {experienceLevel.map((ex, index) => (
                                            <option key={index} value={ex}>{ex}</option>))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block m-2">Type of Job</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400"
                                        value={dataJob.job_type} style={{ width: "100%" }}
                                        onChange={e => handleChange({ target: { name: 'job_type', value: e.target.value } })}  >
                                        <option value="" disabled>-- Select Type of Job --</option>
                                        {typeJob.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block m-2">
                                    Description<strong className="text-red-500"> *</strong>
                                </label>
                                <InputCustom type="textarea" name="description"
                                    value={dataJob.description} onChange={handleChange}
                                    label="Enter Description" required={true}
                                    style={{ minHeight: "120px" }} />
                            </div>
                            <div>
                                <label className="block m-2">
                                    Requirement<strong className="text-red-500"> *</strong>
                                </label>
                                <InputCustom type="textarea" name="requirements"
                                    value={dataJob.requirements} onChange={handleChange}
                                    label="Enter Requirement" required={true}
                                    style={{ minHeight: "120px" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-md col-span-4 rounded-lg">
                        <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Salary & Location</h2>
                        <div >
                            <label className="block m-2">Skill<strong className="text-red-500"> *</strong></label>
                            <select value={selectSkill} multiple name="required_skill" onChange={handleSkillChange}
                                placeholder="Select Type" required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400">
                                {skillList.map((skill, index) => (
                                    <option key={index} value={skill}>{skill}</option>))}
                            </select>
                        </div>
                        <div className="mt-2">
                            <label className="block m-2">Salary</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        name="salary_min"
                                        value={dataJob.salary_min}
                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg"
                                        placeholder="Min"
                                        onChange={handleChange}
                                    />
                                </div>
                                <span className="text-gray-500">-</span>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        name="salary_max"
                                        value={dataJob.salary_max}
                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg"
                                        placeholder="Max"
                                        onChange={handleChange}
                                    />
                                </div>
                                <span className="text-gray-700 font-medium">VND</span>
                            </div>

                            {/* Dòng hiển thị tự động, tách riêng khỏi form */}
                            {(dataJob.salary_min || dataJob.salary_max) && (
                                <div className="mt-1 text-sm text-gray-500">
                                    {dataJob.salary_min && (
                                        <span>
                                            Matching {Number(dataJob.salary_min * 1000).toLocaleString("en-US")} VND
                                        </span>
                                    )}
                                    {dataJob.salary_min && dataJob.salary_max && <span> - </span>}
                                    {dataJob.salary_max && (
                                        <span>
                                            {Number(dataJob.salary_max * 1000).toLocaleString("en-US")} VND
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-2">
                            <label className="block mb-2">
                                Location<strong className="text-red-500"> *</strong>
                            </label>
                            <InputCustom type="text" name="location" required={true}
                                value={dataJob.location} onChange={handleChange}
                                placeholder="Enter location" />
                        </div>
                        <div className="mt-2">
                            <label className="block mb-2">Deadline</label>
                            <input type="date" name="deadline"
                                value={dataJob.deadline ? dataJob.deadline.split('T')[0] : ''}
                                onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-1"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block mb-2">Status</label>
                            <div className="flex">
                                <div className="flex w-full">
                                    <input type="radio" name="status" value="active" checked={selectStatus === 'active'}
                                        onChange={handleStatusChange} className="w-4 h-4 mt-1 mr-4" />
                                    <label className="block mb-2">Active</label>
                                </div>
                                <div className="flex w-full">
                                    <input type="radio" name="status" value="published" checked={selectStatus === 'published'}
                                        onChange={handleStatusChange} className="w-4 h-4 mt-1 mr-4" />
                                    <label className="block mb-2">Published</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-4 m-4">
                    <button type="button" onClick={() => router.push('/job/job-list')}
                        className="mr-10 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg "
                    >  Cancel
                    </button>
                    <button onClick={handleSubmit}
                        className="ms-10 bg-blue-600 text-white px-4 py-2 rounded-lg "
                    >   Save
                    </button>
                </div>
            </div>
        </div >
    )
}
export default NewJob