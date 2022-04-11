let client;

// this object will store calculation for how many articles per section id
const sortBySection = {};

// this object will store section ids and the category id they belong to
const sortByCategory = {};

// this object will store the calculation for how many articles per category id
const articlesPerCategory = {};

$(function () {
  client = ZAFClient.init();
  client.invoke("resize", { width: "100%", height: "200px" });
});

// first we will get all articles currently in help center then sort by section
function getAllArticles() {
  let settings = {
    url: "/api/v2/help_center/en-us/articles.json",
    type: "GET",
    dataType: "json",
  };
  // making request to get all articles
  client
    .request(settings)
    .then((data) => {
      const articles = data.articles;
      for (let i = 0; i < articles.length; i++) {
        let currentArticle = articles[i];
        //then get the article's section id and begin to caluclate how many articles per section id
        let sectionId = currentArticle.section_id;
        if (!sortBySection[sectionId]) {
          sortBySection[sectionId] = 1;
        } else {
          sortBySection[sectionId]++;
        }
      }
    })
    .catch((response) => {
      console.log(response);
    });
}

// create object to map section ids to category id
function matchSectionToCategory() {
  getAllArticles();
  let settings = {
    url: "/api/v2/help_center/en-us/sections.json",
    type: "GET",
    dataType: "json",
  };

  return client
    .request(settings)
    .then((data) => {
      const sections = data.sections;
      for (let i = 0; i < sections.length; i++) {
        let currentSection = sections[i];
        let categoryId = currentSection.category_id;
        let sectionId = currentSection.id;
        sortByCategory[sectionId] = categoryId;
        if (!articlesPerCategory[categoryId]) {
          articlesPerCategory[categoryId] = 0;
        }
      }
    })
    .catch((response) => {
      console.log(response);
    });
}

// now calculate how many articles per category by using using total articles for each section id and adding it to its corresponding catagory id.
async function calculateArticlesPerCategory() {
  await matchSectionToCategory();
  for (const key in sortBySection) {
    let totalPerSection = sortBySection[key];
    let newKey = sortByCategory[key];
    articlesPerCategory[newKey] += totalPerSection;
  }

  console.log("Articles per category ID: ", articlesPerCategory);
}
