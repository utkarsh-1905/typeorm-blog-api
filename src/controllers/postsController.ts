import { Request, Response } from "express";
import { dataSource } from "../data-source";
import { Blogs } from "../entities/Blogs";
import { Users } from "../entities/Users";

async function createPost(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (
      !req.body.title ||
      !req.body.content ||
      !req.body.category ||
      !req.body.keywords
    ) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    const token = req.headers.authorization;
    const user: Users | null = await dataSource.getRepository(Users).findOne({
      relations: ["auth"],
      where: {
        auth: {
          token,
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "No user found",
      });
    }

    const { title, content, category, keywords } = req.body;
    let keywordArray = keywords.split(",");
    keywordArray = keywordArray.map((keyword: string) => keyword.trim());

    let blog = new Blogs();
    blog.title = title;
    blog.content = content;
    blog.keywords = keywordArray;
    blog.author = user;
    blog.dislikes = 0;
    blog.likes = 0;
    blog.created_at = new Date();
    blog.comments = [];
    const categoryArray = await category.trim().split(",");

    blog.category = categoryArray;

    const savedBlog = await dataSource.getRepository(Blogs).save(blog);
    res.status(200).json({
      message: "Blog created successfully",
      id: savedBlog.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
}

async function getBlogByID(req: Request, res: Response) {
  try {
    const blog = await dataSource.getRepository(Blogs).findOne({
      relations: {
        author: {
          profile: true,
        },
        comments: true,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      ...blog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

async function updateBlogByID(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token: string = req.headers.authorization;

    const user: Blogs | null = await dataSource.getRepository(Blogs).findOne({
      relations: {
        author: {
          auth: true,
        },
      },
      where: {
        id: parseInt(req.params.id),
        author: {
          auth: {
            token: token,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (
      !req.body.title ||
      !req.body.content ||
      !req.body.keywords ||
      !req.body.category
    ) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    const blog = await dataSource.getRepository(Blogs).update(
      {
        id: parseInt(req.params.id),
      },
      {
        title: req.body.title,
        content: req.body.content,
        keywords: req.body.keywords,
        category: req.body.category,
      }
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

//to delete a blog
//first check if the user is authorized
//then delete the relation in Users table,
//delete the comments associated with the blog
//and then delete the blog

async function deletePostByID(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const user = await dataSource.getRepository(Users).findOne({
      relations: {
        auth: true,
        blogs: true,
      },
      where: {
        auth: {
          token: req.headers.authorization,
        },
        blogs: {
          id: parseInt(req.params.id),
        },
      },
    });

    if (!user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const token = req.headers.authorization;

    const deletedBlog = await dataSource
      .getRepository(Blogs)
      .createQueryBuilder("blog")
      .leftJoinAndSelect("blog.author", "author")
      .leftJoinAndSelect("author.auth", "auth", "auth.token=:token", {
        token: token,
      })
      .delete()
      .where("id=:id", { id: parseInt(req.params.id) })
      .execute();

    if (!deletedBlog) {
      res.status(404).json({
        message: "Blog not found/Unauthorized",
      });
      return;
    }

    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
}

//re-check for ordering and pagination
async function getAllPosts(req: Request, res: Response) {
  try {
    //query params for pagination
    const count: any = req.query.count || "10";
    const page: any = req.query.page || "1";

    let blogs = await dataSource
      .getRepository(Blogs)
      .createQueryBuilder("blog")
      .leftJoinAndSelect("blog.author", "author")
      .leftJoinAndSelect("blog.comments", "comments")
      .orderBy("blog.likes", "DESC")
      .addOrderBy("blog.created_at", "DESC")
      .skip((parseInt(page) - 1) * parseInt(count))
      .take(parseInt(count))
      .getMany();

    blogs = blogs.sort((a: Blogs, b: Blogs): number => {
      if (a.comments.length > b.comments.length) {
        return -1;
      } else {
        return 0;
      }
    });

    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
}

export { createPost, getBlogByID, updateBlogByID, deletePostByID, getAllPosts };
