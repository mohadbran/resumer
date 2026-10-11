async function fetchResumeData() {
  const response = await fetch("https://script.google.com/macros/s/AKfycbw_cz___UPl6oKIhPbkQq3IWOVK7XsrR62cc-5yU2uw6Hro9lLIaUxiD_wNHoPpTPg/exec");
  const data = await response.json();
  return data;
}