"use client"
import { useRouter } from "next/navigation"
import SelectCustom from './../../../../components/ui/Select/SelectCustom';
import InputCustom from './../../../../components/ui/InputCustom/InputCustom';
import { useState, useEffect } from 'react'
import axios from 'axios';

const NewJob = () => {
    const data = {
        company_id: "", category_id: "", title: "", description: "", requirements: "", salary_min: "", salary_max: "", location: "",
        job_type: "Full-time", experience_level: "Mid-level", number_of_positions: 1, status: "active", deadline: "2024-12-31", required_skills: ""
    }
    const router = useRouter()
    const [dataJob, setDataJob] = useState(data)
    const [jobPosts, setJobPosts] = useState([])
    const [cateName, setCateName] = useState([])
    const [compName, setCompName] = useState([])
    const [selectSkill, setSelectSkill] = useState([])
    const [selectStatus, setSelectStatus] = useState('active')

    useEffect(() => {
        const fetchJob = async () => {
            await axios.get('http://localhost:9999/job/job-list')
                .then(res => setJobPosts(res.data.data))
                .catch(err => console.error(err))
        }
        const fechCategoryName = async () => {
            await axios.get('http://localhost:9999/job/category-name')
                .then(res => setCateName(res.data.data))
                .catch(err => console.error(err))
        }
        const fechCompanyName = async () => {
            await axios.get('http://localhost:9999/job/company-name')
                .then(res => setCompName(res.data.data))
                .catch(err => console.error(err))
        }
        fetchJob();
        fechCategoryName();
        fechCompanyName()
    }, [])

    const skillList = [...new Set(jobPosts.map(job => job.required_skills)
        .flatMap(item => item.split(', ').map(skill => skill.trim())))];

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

    const handleSubmit = async () => {
        const { title, description, requirements, required_skills, location, company_id, category_id } = dataJob;

        if (!title || !description || !requirements || !required_skills || !location || !company_id || !category_id) {
            alert('Please enter complete information');
            return;
        }
        try {
            const response = await axios.post('http://localhost:9999/job/create-job', {
                ...dataJob,
                salary_min: Number(dataJob.salary_min),
                salary_max: Number(dataJob.salary_max),
                number_of_positions: Number(dataJob.number_of_positions),
                status: selectStatus
            });
            if (response.data.success) {
                alert('Job created successfully!');
                router.push("/job/job-list");
            }
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || error.message));
        }
    }
    return (
        <div className="p-10 bg-[#CDE5F1]">
            <div className="flex justify-between mb-6 p-4 bg-[white] rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">CREATE NEW RECRUITMENT POST</h2>
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
                                    <SelectCustom label="-- Select Company --"
                                        value={dataJob.company_id} style={{ width: "100%" }}
                                        onChange={(value) => handleChange({ target: { name: 'company_id', value } })}  >
                                        {compName.map(c => (
                                            <SelectCustom.Option key={c.id} value={c.id}>
                                                {c.name}
                                            </SelectCustom.Option>
                                        ))}
                                    </SelectCustom>
                                </div>
                                <div>
                                    <label className="block m-2">
                                        Category<strong className="text-red-500"> *</strong>
                                    </label>
                                    <SelectCustom label="-- Select Category --"
                                        value={dataJob.category_id} style={{ width: "100%" }}
                                        onChange={(value) => handleChange({ target: { name: 'category_id', value } })} >
                                        {cateName.map(c => (
                                            <SelectCustom.Option key={c.id} value={c.id}>
                                                {c.name}
                                            </SelectCustom.Option>
                                        ))}
                                    </SelectCustom>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block m-2">Level of experience</label>
                                    <SelectCustom label="-- Select Level of experience --"
                                        value={dataJob.experience_level} style={{ width: "100%" }}
                                        onChange={(value) => handleChange({ target: { name: 'experience_level', value } })}>
                                        {experienceLevel.map((ex, index) => (
                                            <SelectCustom.Option key={index} value={ex}>
                                                {ex}
                                            </SelectCustom.Option>
                                        ))}
                                    </SelectCustom>
                                </div>

                                <div>
                                    <label className="block m-2">Type of Job</label>
                                    <SelectCustom label="-- Select Type of Job --"
                                        value={dataJob.job_type} style={{ width: "100%" }}
                                        onChange={(value) => handleChange({ target: { name: 'job_type', value } })}  >
                                        {typeJob.map((type, index) => (
                                            <SelectCustom.Option key={index} value={type}>
                                                {type}
                                            </SelectCustom.Option>
                                        ))}
                                    </SelectCustom>
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
                            <label className="block mb-2">Salary</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <input type='number' name="salary_min" placeholder="Min"
                                        value={dataJob.salary_min} onChange={handleChange}
                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg placeholder-gray-400" />
                                </div>
                                <span className="text-gray-500">-</span>
                                <div className="flex-1">
                                    <input type='number' name="salary_max" placeholder="Max"
                                        value={dataJob.salary_max} onChange={handleChange}
                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg placeholder-gray-400" />
                                </div>
                                <span className="text-gray-700 font-medium">VND</span>
                            </div>
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
                                    <input type="radio" name="status" value="public" checked={selectStatus === 'public'}
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