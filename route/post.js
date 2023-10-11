const express = require("express");
const Post = require("./../module/post");
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Post() });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Post.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

router.get("/:slug", async (req, res) => {
  const article = await Post.findPostBySlug({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

router.post(
  "/",
  async (req, res, next) => {
    req.article = new Post();
    next();
  },
  savePostAndRedirect("new")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Post.findById(req.params.id);
    next();
  },
  savePostAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Post.deletePostById(req.params.id);
  res.redirect("/");
});

function savePostAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router;
