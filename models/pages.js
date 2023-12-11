    let defaultPage = {
        id: null,
        name: null,
        username: null,
        dp: null,
        socialLink: null,
    }

 const dynamicPage = (res , FoundUser)=>{ res.render("index",{
        id: FoundUser.id,
        name: FoundUser.name,
        username: FoundUser.username,
        dp: FoundUser.dp,
        socialLink: FoundUser.socialLink,
      })
    }


 const notFound = (res)=>{ res.render("index",{
        id: "Not Found",
        name: "Not Found",
        username: "Not Found",
        dp: null,
        socialLink: "Not Found"
      })
    }
    
  module.exports = {
    defaultPage,
     dynamicPage,
     notFound
  }