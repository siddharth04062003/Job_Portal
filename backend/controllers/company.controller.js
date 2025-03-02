import mongoose from "mongoose";
import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company Name NOT FOUND or INVALID.",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "Company already exists with this name.",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company Registered Successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// all company by the userId
export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //Loggedin User Id
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "Companies Not Found",
        success: false,
      });
    }
    return res.status(200).json({
      message: `All the Companies registered is this user id ${req.id}`,
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//get company by id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    if (!companyId) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company Not Found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: `Company with this id ${req.params.id}`,
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//update company info

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    //cloudinary

    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if(!company){
        return res.status(404).json({
            message:"Company not found.",
            success:false
        })
    }
    return res.status(200).json({
        message: `Company updated with this  ${req.params.id}`,
        company,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
