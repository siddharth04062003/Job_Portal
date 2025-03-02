import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";


export const applyJob = async (req,res)=>{
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                msg:"Job Id is required.",
                success:false
            })
        }
        // check if the user has already applied for the job 
        const existingApplication = await Application.findOne({job:jobId, applicant:userId});
        if(existingApplication){ 
            return res.status(400).json({
                msg:"You have already applied for the job",
                success:false
            });
        }
        //check if the job exists
        const job = await Job.findById(jobId);

        if(!job){
            res.status(404).json({
                msg:"Job not found",
                success:false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        })

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            msg:"Job applied Successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAppliedJobs = async(req,res) =>{
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:({
                path:'company',
                options:{sort:{createdAt:-1}},
            })
        });
        if(!application){
            return res.status(404).json({
                msg:"No Application",
                success:false
            })
        }
        return res.status(200).json({
            msg:"Found Data",
            application,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

//admin want to see how many users have applied 
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:({
                path:'applicant',
                options:{sort:{createdAt:-1}},
            })
        })
        if(!job){
            return res.status(404).json({
                msg:"Job Not Found",
                success:false
            })
        };
        return res.status(200).json({
            msg:"Job Details are below",
            job,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async(req,res)=>{
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                msg:"status is required ",
                success:false
            })
        };

        //find the application by appliction id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                msg:"Application Not Found",
                success: false
            })
        };

        //update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            msg:"Status Updated",
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}