async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function renderSurveyResults(entries) {
  const ul = document.getElementById('surveyResults');
  ul.innerHTML = '';
  entries.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${entry.name}</strong> (Age: ${entry.age}, Gender: ${entry.gender})<br/>
      Favorite Sport: ${entry.sport}<br/>
      Favorite Player: ${entry.player}<br/>
      Plays Sports: ${entry.frequency}<br/>
      Would Recommend: ${entry.recommend}
    `;
    ul.appendChild(li);
  });
}

function renderPopularSports(entries) {
  const sportCount = {};
  entries.forEach(entry => {
    sportCount[entry.sport] = (sportCount[entry.sport] || 0) + 1;
  });

  const sorted = Object.entries(sportCount).sort((a, b) => b[1] - a[1]);

  const ul = document.getElementById('popularSports');
  ul.innerHTML = '';
  sorted.forEach(([sport, count]) => {
    const li = document.createElement('li');
    li.textContent = `${sport}: ${count} votes`;
    ul.appendChild(li);
  });
}

async function loadSurveyData() {
  try {
    const data = await fetchJSON('/survey');
    renderSurveyResults(data);
    renderPopularSports(data);
  } catch (err) {
    alert('Failed to load survey data: ' + err.message);
  }
}

document.getElementById('surveyForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;

  const formData = new FormData(form);
  const data = {
    name: formData.get('name').trim(),
    age: formData.get('age').trim(),
    sport: formData.get('sport').trim(),
    player: formData.get('player').trim(),
    gender: formData.get('gender'),
    frequency: formData.get('frequency'),
    recommend: formData.get('recommend')
  };

  // Basic validation
  if (Object.values(data).some(v => !v)) {
    alert('Please fill in all fields');
    return;
  }

  try {
    await fetchJSON('/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    form.reset();
    await loadSurveyData();
  } catch (err) {
    alert('Failed to submit survey: ' + err.message);
  }
});

document.addEventListener('DOMContentLoaded', loadSurveyData);
