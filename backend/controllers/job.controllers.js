import { Job } from "../models/job.model.js";

// Admin Will Post Job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }
    if (isNaN(Number(salary)) || Number(salary) <= 0) {
      return res.status(400).json({
        message: "Invalid salary value.",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: Number(experience),
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New Job Created Successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Student Will Get All Jobs Here
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Student Can Get Job By ID
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Admin Jobs Count
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
