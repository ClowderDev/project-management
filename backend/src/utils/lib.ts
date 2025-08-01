import ActivityModel from "../models/activity.model";

export const recordActivity = async (
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details: Record<string, any>
) => {
  try {
    await ActivityModel.create({
      user: userId,
      action,
      resourceType,
      resourceId,
      details,
    });
  } catch (error) {
    console.log(error);
  }
};
