export interface User {
  _id: string;
  fullName: string;
  profileImageURL?: string;
}

export interface Comment {
  _id: string;
  content: string;
  blogId: string;
  createdBy: User;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  body: string;
  coverImageURL: string;
  createdBy: User;
  createdAt: string;
}
