window.addEventListener("load", () => {
  let latitude,
    longitude = "";
  let countryCode;
  let cityName;
  const enter = document.getElementById("enter");
  const APIkey = "2b6d07461feadcdf3cd7561a2b056d5f";
  const container = document.querySelector(".container");
  const search = document.querySelector(".search");
  const form = document.querySelector("form");
  const location = document.querySelector(".location");

  location.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert("Tarayıcınız konum bilgisini alamıyor... ");
    }
    function onSuccess(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      const api_key = "5e76c2522650449d931ae7c0b67a2d0c";
      const url1 = ` https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${api_key}`;
      fetch(url1)
        .then((response) => response.json())
        .then((result) => {
          let details = result.results[0].components.province;

          enter.value = details;

          getWeatherApi();
          form.reset();
        });
    }
    function onError(error) {
      if (error.code == 1) {
        alert("Kullanıcı erişim iznini reddetti.");
      } else if (error.code == 2) {
        alert("Konum alınamadı");
      } else {
        alert("Bir hata oluştu.");
      }
    }
  });

  search.addEventListener("click", () => {
    getWeatherApi();
    form.reset();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e);
    getWeatherApi();
    form.reset();
  });
  const getWeatherApi = async () => {
    cityName = enter.value;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${APIkey}`
    );
    const data = await response.json();

    const { name, sys, weather, main } = data;
    const h2Array = container.querySelectorAll("h2");
    console.log(h2Array);
    if (h2Array.length > 0) {
      console.log(h2Array.length);
      const filterArray = [...h2Array].filter((h2) => h2.innerText == name);
      console.log(filterArray);
      if (filterArray.length > 0) {
        console.log(filterArray);
        alert("bu şehir daha önce vardı");
        return;
      }
    }
    const box = document.createElement("div");
    box.setAttribute("class", "box");
    container.prepend(box);

    box.innerHTML = `
    <h2 class="city">${name}</h2><sup class="country">${
      sys.country
    }</sup><i class="close fa-solid fa-rectangle-xmark"></i><hr>
    
    <span class="deg">${Math.floor(main.temp - 273.15)}<span>°C</span></span>
    <figure>
      <img src=https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0].icon
      }.svg alt="weather" />
      <figcaption>${weather[0].description}</figcaption>
    </figure>
`;
    const close = document.querySelector(".close");
    close.addEventListener("click", (e) => {
      e.target.closest("div").remove();
    });
    // if (`${Math.floor(main.temp - 273.15)}` <= 0) {
    //   box.style.background = "url(./image/snow.jpeg)";
    // } else if (`${Math.floor(main.temp - 273.15)}` <= 7) {
    //   box.style.background = "url(./image/spring.jpg)";
    // } else {
    //   box.style.background = "url(./image/summer.jpeg)";
    // }
    console.log(data);
  };
});
