module.exports = {
  "Article": [
    {
      "path": "author",
      "select": "avatar nikname"
    },
    {
      "path": "comments",
      "select": "content date uid",
      // 递归populate
      "populate": {
        "path": "uid",
        "select": "avatar nikname"
      }
    },
    {
      "path": "column",
      "select": "name"
    }
  ],
  "Comment": [
    {
      "path": "uid",
      "select": "avatar nikname"
    }
  ],
  "Column": [
    {
      "path": "aids",
      "select": "title cover date hit_num comment_num like_num author"
    }
  ],
  // "User": [
  //   {
  //     "path": "",
  //     "select": "nikname avatar username email"
  //   }
  // ]
}