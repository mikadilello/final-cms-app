//BEFORE USING got MUST DO: npm install got@9.6.0
import got from 'got';


// define URL for rest endpoint
const dataURL = "https://dev-cs55-13-site.pantheonsite.io/wp-json/twentytwentyone-child/v1/special";

// fnct returns ids for all json objects in array
export async function getAllIds() {

  let jsonString;
  try {
    // next line uses got synchronously to retrieve via https out json data from wp site
    jsonString = await got(dataURL);
    // console.log(jsonString.body);
  } catch {
    jsonString.body = [];
    console.log(error);
  }

  // convert string from file into json array obj
  const jsonObj = JSON.parse(jsonString.body);

  return jsonObj.map(item => {
    return {
      params: {
        id: item.ID.toString()
      }
    }
  });
}

// fnct returns names and ids for all json objects in array, sorted by name property
export async function getSortedList() {

let jsonString;
  try {
    // next line uses got synchronously to retrieve via https out json data from wp site
    jsonString = await got(dataURL);
    console.log(jsonString.body);
  } catch {
    jsonString.body = [];
    console.log(error);
  }

  const jsonObj = JSON.parse(jsonString.body);

  // sort json obj by title
  jsonObj.sort(function (a, b) {
    return a.post_title.localeCompare(b.post_title);
  });

  return jsonObj.map(item => {
    return {
      id: item.ID.toString(),
      name: item.post_title
    }
  });}

// async function to get the complete data for just one person
export async function getData(idRequested) {
  
  let jsonString;
  try {
    // next line uses got synchronously to retrieve via https out json data from wp site
    jsonString = await got(dataURL);
    console.log(jsonString.body);
  } catch {
    jsonString.body = [];
    console.log(error);
  }

  const jsonObj = JSON.parse(jsonString.body);
  const objMatch = jsonObj.filter( obj => {
    return obj.ID.toString() === idRequested;
  });
    // extract object value in fileted array if any
  let objReturned;
  if (objMatch.length > 0) {
    objReturned = objMatch[0];
  } else {
    objReturned = {};
  }
  return objReturned;

}