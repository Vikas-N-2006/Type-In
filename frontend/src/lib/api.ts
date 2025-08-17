// --- /lib/api.ts ---
import { Blog, Comment } from "@/types";

const API_URL = 'http://localhost:8000';

// Helper to get the full image URL
export const getImageUrl = (path: string) => `${API_URL}${path}`;

// Helper to handle API responses and errors
async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }
    return data;
}

// Fetch all blogs (for home page)
export async function getBlogs(): Promise<{ blogs: Blog[] | null, error: string | null }> {
    try {
        const res = await fetch(`${API_URL}/api/blogs`, { cache: 'no-store' });
        if (!res.ok) {
            return { blogs: null, error: `HTTP error! Status: ${res.status}` };
        }
        const blogs: Blog[] = await res.json();
        const sortedBlogs = blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return { blogs: sortedBlogs, error: null };
    } catch (error: any) {
        console.error("Fetch error:", error);
        return { blogs: null, error: "Could not fetch blogs. This is likely a CORS issue or the backend server is not running." };
    }
}

// Fetch a single blog
export const getBlogById = (id: string) => fetch(`${API_URL}/api/blogs/${id}`).then(res => handleResponse<Blog>(res));

// Fetch comments for a blog
export const getCommentsByBlogId = (id: string) => fetch(`${API_URL}/api/blogs/${id}/comments`).then(res => res.ok ? res.json() : []);

// Auth and Blog Post APIs for use with the mutation hook
export const api = {
    login: (credentials: any) => fetch(`${API_URL}/api/users/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(res => handleResponse<{ token: string }>(res)),

    signup: (userData: any) => fetch(`${API_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }).then(res => handleResponse(res)),

    createBlog: ({ formData, token }: { formData: FormData, token: string }) => fetch(`${API_URL}/api/blogs`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    }).then(res => handleResponse<Blog>(res)),

    postComment: ({ blogId, content, token }: { blogId: string, content: string, token: string }) => fetch(`${API_URL}/api/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content })
    }).then(res => handleResponse<Comment>(res)),
};