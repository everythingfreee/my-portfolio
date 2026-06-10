import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

export interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  published: boolean;
  createdAt: Timestamp | Date | any;
  updatedAt: Timestamp | Date | any;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  createdAt: Timestamp | Date | any;
  updatedAt: Timestamp | Date | any;
}

export interface AboutData {
  bio: string;
  title: string;
  avatarUrl?: string;
  updatedAt: any;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
}

// Helper function to safely convert Firestore Timestamp
function safeTimestamp(timestamp: any): Date | null {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (typeof timestamp === 'object' && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return null;
}

// Fetch all published projects
export async function getPublishedProjects(): Promise<Project[]> {
  try {
    console.log("Fetching published projects...");
    
    const projectsRef = collection(db, "projects");
    const q = query(
      projectsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.size} published projects`);
    
    if (querySnapshot.empty) {
      // Try to fetch all projects to debug
      const allProjectsQuery = query(projectsRef);
      const allProjects = await getDocs(allProjectsQuery);
      console.log(`Total projects in DB: ${allProjects.size}`);
      
      allProjects.forEach(doc => {
        console.log(`Project: ${doc.id}, published: ${doc.data().published}`);
      });
    }
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "Untitled",
        description: data.description || "",
        content: data.content || "",
        imageUrl: data.imageUrl,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        tags: data.tags || [],
        published: data.published === true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }) as Project[];
  } catch (error) {
    console.error("Error fetching published projects:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return [];
  }
}

// Fetch single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Project;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
}

// Fetch all published blogs
export async function getPublishedBlogs(): Promise<Blog[]> {
  try {
    console.log("Fetching published blogs...");
    
    const blogsRef = collection(db, "blogs");
    const q = query(
      blogsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.size} published blogs`);
    
    if (querySnapshot.empty) {
      // Try to fetch all blogs to debug
      const allBlogsQuery = query(blogsRef);
      const allBlogs = await getDocs(allBlogsQuery);
      console.log(`Total blogs in DB: ${allBlogs.size}`);
      
      allBlogs.forEach(doc => {
        console.log(`Blog: ${doc.id}, slug: ${doc.data().slug}, published: ${doc.data().published}`);
      });
    }
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "Untitled",
        slug: data.slug || doc.id,
        description: data.description || "",
        content: data.content || "",
        imageUrl: data.imageUrl,
        published: data.published === true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }) as Blog[];
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Check for index error
      if (error.message.includes("index")) {
        console.error("⚠️ Missing Firestore index. Please create the required index.");
        console.error("Visit: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore/indexes");
      }
    }
    return [];
  }
}

// Fetch single blog by Slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    console.log(`Fetching blog with slug: ${slug}`);
    
    const q = query(
      collection(db, "blogs"),
      where("slug", "==", slug),
      where("published", "==", true),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();
      console.log(`Found blog: ${data.title}`);
      return { 
        id: docSnap.id, 
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Blog;
    }
    
    console.log(`No blog found with slug: ${slug}`);
    return null;
  } catch (error) {
    console.error(`Error fetching blog with slug ${slug}:`, error);
    return null;
  }
}

// Fetch About page biography and settings
export async function getAboutContent(): Promise<AboutData | null> {
  try {
    const docRef = doc(db, "about", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as AboutData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching about content:", error);
    return null;
  }
}

// Fetch all skills
export async function getSkills(): Promise<Skill[]> {
  try {
    const q = query(collection(db, "skills"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Skill[];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}