"use client"
import { useRouter, useParams } from "next/navigation"
import InputCustom from './../../../../../components/ui/InputCustom/InputCustom';
import { useState, useEffect } from 'react'
import axios from 'axios';
import { Descriptions } from "antd";
const UpdateJob = () => {
    const data = {
        company_id: "", category_id: "", title: "", description: "", requirements: "", salary_min: "", salary_max: "", location: "",
        job_type: "Full-time", experience_level: "Mid-level", number_of_positions: 1, status: "active", deadline: "2024-12-31", required_skills: ""
    }
    const router = useRouter()
    const params = useParams();
    const job_id = params.id
    const [dataJob, setDataJob] = useState(data)
    const [jobPosts, setJobPosts] = useState([])
    const [cateName, setCateName] = useState([])
    const [compName, setCompName] = useState([])
    const [selectSkill, setSelectSkill] = useState([])
    const [selectStatus, setSelectStatus] = useState('active')

    useEffect(() => {
        const fetchAllData = async () => {
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
                    // setError("Please login first");
                    // setLoading(false);
                    return;
                }

                const fetchJobList = async () => {
                    const response = await axios.get('http://localhost:9999/job/job-list', {
                        params: { userId: user.id },
                        timeout: 10000
                    });
                    setJobPosts(response.data.data || []);
                };
                const fetchJobDetail = async () => {
                    if (job_id) {
                        const response = await axios.get('http://localhost:9999/job/job-list', {
                            params: { userId: user.id },
                            timeout: 10000
                        });
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
                            setSelectStatus(jobData.status || "active");
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
                    const response = await axios.get('http://localhost:9999/job/company-name', {
                        params: { userId: user.id },
                        timeout: 10000
                    });
                    setCompName(response.data.data || []);
                };
                await Promise.all([fetchJobList(), fetchJobDetail(), fechCategoryName(), fechCompanyName()]);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchAllData();
    }, [job_id]);

    const skillList = [
        ...new Set(
            (jobPosts || [])
                .map(job => job.required_skills || '')
                .flatMap(item => item.split(',').map(skill => skill.trim()))
                .filter(skill => skill !== '')
        )
    ];

    const experienceLevel = [...new Set(
        (jobPosts || []).map(job => job.experience_level).filter(Boolean)
    )];

    const typeJob = [...new Set(
        (jobPosts || []).map(job => job.job_type).filter(Boolean)
    )];

    const uniCategory = [...new Map(cateName.map(category => [category.id, category])).values()];
    const uniCompany = [...new Map(compName.map(company => [company.id, company])).values()];
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
    const handleSubmit = async () => {
        if (!dataJob.company_id || !dataJob.category_id || !dataJob.title || !dataJob.description || !dataJob.requirements || !dataJob.location || !dataJob.number_of_positions) {
            alert('Please enter complete information');
            return;
        }
        if (dataJob.number_of_positions <= 0) {
            alert('Number of positions must be greater than 0');
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
            let mysqlDeadline = '2024-12-31';
            if (dataJob.deadline) {
                if (dataJob.deadline.includes('T')) {
                    mysqlDeadline = dataJob.deadline.split('T')[0];
                } else {
                    mysqlDeadline = dataJob.deadline;
                }
            }
            const userData = JSON.parse(localStorage.getItem("loggedInUser"));
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
                required_skills: dataJob.required_skills || '',
                updated_by: userData?.id || null
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
        <div className="p-10 bg-[#CDE5F1]">
            <div className="flex justify-between mb-6 p-4 bg-[white] rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">UPDATE RECRUITMENT POST</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border border-gray-300"
                    onClick={() => router.push("/job/job-list")}>Back
                </button>
            </div>
            <div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-md col-span-8 ">
                        <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center"> Basic information </h2>
                        <div>
                            <div className=" mb-2">
                                <label className="block m-2">Title<strong className="text-red-500"> *</strong></label>
                                <InputCustom type="text" name="title" value={dataJob.title} onChange={handleChange} required={true} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block m-2">Company</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400"
                                        value={dataJob.company_id} style={{ width: "100%" }}
                                        onChange={(e) => handleChange({ target: { name: 'company_id', value: e.target.value } })}  >
                                        <option value="" disabled>Select Company </option>
                                        {uniCompany.map((c, index) => (
                                            <option key={index} value={c.id}>{c.name}</option>))}
                                    </select>
                                </div>
                                <div >
                                    <label className="block m-2">Category</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400"
                                        value={dataJob.category_id} style={{ width: "100%" }}
                                        onChange={(e) => handleChange({ target: { name: 'category_id', value: e.target.value } })} >
                                        <option value='' disabled>-- Select Category --</option>
                                        {uniCategory.map((c, index) => (
                                            <option key={index} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div >
                                    <label className="block m-2">Level of experience</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400"
                                        value={dataJob.experience_level} style={{ width: "100%" }}
                                        onChange={(e) => handleChange({ target: { name: 'experience_level', value: e.target.value } })}>
                                        <option value='' disabled>Select Level of experience</option>
                                        {experienceLevel.map((ex, index) => (
                                            <option key={index} value={ex}>{ex}</option>
                                        ))}
                                    </select>
                                </div>
                                <div >
                                    <label className="block m-2">Type of Job</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400"
                                        value={dataJob.job_type} style={{ width: "100%" }}
                                        onChange={(e) => handleChange({ target: { name: 'job_type', value: e.target.value } })}  >
                                        <option value='' disabled>Select Type of Job</option>
                                        {typeJob.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block m-2">Description<strong className="text-red-500"> *</strong></label>
                                <InputCustom type="textarea" name="description"
                                    value={dataJob.description} onChange={handleChange}
                                    required={true} style={{ minHeight: "120px" }} />
                            </div>
                            <div>
                                <label className="block m-2">Requirement<strong className="text-red-500"> *</strong></label>
                                <InputCustom type="textarea" name="requirements"
                                    value={dataJob.requirements} onChange={handleChange}
                                    required={true} style={{ minHeight: "120px" }} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-md col-span-4 rounded-lg">
                        <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Salary & Location</h2>
                        <div >
                            <label className="block m-2">Skill</label>
                            <select value={selectSkill} multiple name="required-skill" onChange={handleSkillChange}
                                placeholder="Select Type" className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400" required>
                                {skillList.map((skill, index) => (<option key={index}>{skill}</option>))}
                            </select>
                        </div>
                        <div className="mt-2">
                            <label className="block m-2">Salary</label>

                            {/* Khối nhập liệu */}
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

                            {/* Khối hiển thị sau khi nhập, nằm dòng riêng */}
                            {(dataJob.salary_min || dataJob.salary_max) && (
                                <div className="mt-1 ms-2 text-sm text-gray-500">
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
                            <label className="block m-2">Location<strong className="text-red-500"> *</strong></label>
                            <InputCustom type="text" name="location" required={true}
                                value={dataJob.location} onChange={handleChange} />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <label className="block m-2">Deadline</label>
                                <input type="date" name="deadline" value={dataJob.deadline ? dataJob.deadline.split('T')[0] : ''}
                                    onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-1" />
                            </div>
                            <div className="flex-1">
                                <label className="block m-2">Number of Positions</label>
                                <input type='number' name="number_of_positions" value={dataJob.number_of_positions}
                                    className="w-full px-4 py-1 border border-gray-300 rounded-lg" placeholder="Number of Positions" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label className="block m-2">Status</label>
                            <div className="flex">
                                <div className="flex w-full">
                                    <input type="radio" name="status" value="active"
                                        checked={dataJob.status === 'active'}
                                        onChange={(e) => {
                                            setDataJob(prev => ({ ...prev, status: e.target.value }));
                                            setSelectStatus(e.target.value);
                                        }} className="w-4 h-4 mt-1 mr-4"
                                    />
                                    <label className="block mb-2">Active</label>
                                </div>
                                <div className="flex w-full">
                                    <input type="radio" name="status" value="published"
                                        checked={dataJob.status === 'published'}
                                        onChange={(e) => {
                                            setDataJob(prev => ({ ...prev, status: e.target.value }));
                                            setSelectStatus(e.target.value);
                                        }}
                                        className="w-4 h-4 mt-1 mr-4"
                                    />
                                    <label className="block mb-2">Published</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-4 m-4">
                    <button
                        type="button" onClick={() => router.push('/job/job-list')}
                        className="mr-10 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg "
                    > Cancel </button>
                    <button onClick={handleSubmit}
                        className="ms-10 bg-blue-600 text-white px-4 py-2 rounded-lg "
                    > Save </button>
                </div>
            </div>

        </div>
    )
}
export default UpdateJob