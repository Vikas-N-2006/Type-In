// --- /lib/api.ts ---
import { Blog, Comment } from "@/types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");
const FRONTEND_DEFAULT_IMAGE = "/images/default.png";

const normalizeBlog = (blog: any): Blog => ({
    ...blog,
    content: blog?.content ?? blog?.body ?? "",
    body: blog?.body ?? blog?.content ?? "",
});

export const getImageUrl = (rawPath?: string | null) => {
    if (!rawPath) return FRONTEND_DEFAULT_IMAGE;

    const trimmed = rawPath.trim();
    if (!trimmed) return FRONTEND_DEFAULT_IMAGE;

    const duplicateAbsoluteMatch = trimmed.match(/^(https?:\/\/[^/]+)(https?:\/\/.+)$/i);
    if (duplicateAbsoluteMatch) {
        return duplicateAbsoluteMatch[2];
    }

    if (/^https?:\/\//i.test(trimmed)) return trimmed;

    let path = trimmed
        .replace(/\\/g, "/")
        .replace(/^\.\/+/, "/")
        .replace(/^public\//, "/")
        .replace(/^\/?public\//, "/")
        .replace(/\/\.\//g, "/");

    if (!path.startsWith("/")) path = `/${path}`;

    if (path.startsWith("/images/")) return path;
    if (path.startsWith("/uploads/")) return `${API_URL}${path}`;
    if (path.startsWith("/api/")) return `${API_URL}${path}`;

    return FRONTEND_DEFAULT_IMAGE;
};

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
        const blogsRaw: any[] = await res.json();
        const blogs = blogsRaw.map(normalizeBlog);
        const sortedBlogs = blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return { blogs: sortedBlogs, error: null };
    } catch (error: any) {
        console.error("Fetch error:", error);
        return { blogs: null, error: "Could not fetch blogs. This is likely a CORS issue or the backend server is not running." };
    }
}

// Fetch a single blog
export const getBlogById = (id: string) =>
    fetch(`${API_URL}/api/blogs/${id}`)
        .then(res => handleResponse<any>(res))
        .then(normalizeBlog);

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
