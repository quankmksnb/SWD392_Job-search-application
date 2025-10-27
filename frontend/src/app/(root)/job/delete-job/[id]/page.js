"use client"
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import axios from 'axios';

const DeleteJob = () => {
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        if (window.confirm(`Delete job ID ${id}?`)) {
            handleDelete();
        } else {
            router.push("/job/job-list");
        }
    }, []);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:9999/job/delete-job/${id}`);
            if (response.data.success) alert('Job deleted!');
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message ?? error.message));
        } finally {
            router.push("/job/job-list");
        }
    };

    return (
        <div className="p-10 flex justify-center items-center">
            <div className="text-gray-500">Processing...</div>
        </div>
    );
};

export default DeleteJob;