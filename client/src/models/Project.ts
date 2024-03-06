interface Team {
  name: string;
  _id: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface ProjectList {
  _id: string;
  name: string;
  image: string;
  team: Team;
  teamSize: number;
  slug: string;
  status: string;
  manager: User;
  teamLead: User[];
}

export interface ProjectGetApiData {
  projectList: ProjectList[];
  totalProject: number;
}

export interface ProjectGetApiResponse extends ProjectGetApiData {
  success: boolean;
  message: string;
}

export interface ProjectAddData {
  name: string;
  teamId: string;
  status: string;
  slug: string;
}

export interface ProjectPostData extends ProjectAddData {
  companyId: string;
}

export interface ReturnObject {
  success: boolean;
  message: string;
}

export interface ProjectPostResponse extends ReturnObject {
  position: ProjectObject;
}

export interface ProjectObject {
  name: string;
  teamId: string;
  companyId: string;
  status: "active" | "inactive" | "deleted";
  slug: string;
  createdBy: string;
}

export interface ProjectDetails {
  name: string;
  teamId: Team;
  // companyId: string;
  status: "active" | "inactive" | "deleted";
  slug: string;
  createdBy: string;
}

export interface ProjectDetailsResponse extends ReturnObject {
  position: ProjectDetails;
}
