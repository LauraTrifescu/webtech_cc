# Weather and Air Quality

Intro

## Descrierea aplicației

De cele mai multe ori, trăind, poate, și într-un oraș aglomerat de mașini care circulă la orice oră și ticsit de fabrici și uzine, pe lângă datele meteorologice pe care le dorim să le aflăm zilnic, cantitatea poluării aerului ar fi o altă informație importantă de reținut înainte de a ieși din casă.
Prezenta aplicație înregistrează locația curentă folosirii și oferă astfel de informații despre vreme și calitatea aerului, mai exact nivelul de Dioxid de Azot, din respectiva locație. 
Pentru aceasta a fost nevoie să folosesc Geolocation API care permite utilizatorilor să își vadă locația prin coordonatele latitudine și longitudine, doar dacă aceștia își oderă acordul. Pentru accessarea informațiilor despre vreme, am folosit API-ul de la OpenWeather, iar datele despre calitatea aerului sunt oferite de OpenAQ.  Integrând toate acestea într-o singură aplicație, a fost posibilă vizualizarea tuturor informațiilor într-o singură pagină Web.


## Prezentare API-urilor
### Geolocation API
API-ul de geolocalizare permite utilizatorului să-și ofere locația aplicațiilor web, dacă dorește acest lucru. Acest API este accesat printr-un apel la navigator.geolocation care va determina browser-ul utilizatorului să le ceară permisiunea de a accesa datele locației sale. Dacă acceptă, browserul va folosi cea mai bună funcționalitate disponibilă pe dispozitiv pentru a accesa aceste informații (de exemplu, GPS).
Eu am accesat această locație prin Geolocation.getCurrentPosition() care returnează locația curentă a device-ului de pe care este folosit. Aceasta inițiază o solicitare asincronă pentru a detecta poziția utilizatorului și solicită hardware-ul de poziționare pentru a obține informații actualizate. Când poziția este determinată, funcția de apelare definită este executată.
O instanță GeolocationPosition este returnată printr-un apel la una dintre metodele conținute în Geolocation și conține un timestamp plus o instanță a obiectului GeolocationCoordinates. Am optat pentru returnarea latitudinii și longitudinii pentru a putea fi folosite mai departe și în accesarea informațiilor despre vreme și poluarea aerului.
### OPEN WEATHER
Printr-un OpenWeather API se pot accesa datele meteo curente pentru peste 200.000 de orașe. Acesta este disponibil printr-un API key pe care l-am primit în urma creării unui cont. Metodele de apelare ale unui API sunt multiple: cu ajutorului numelui orașului, al id-ului acestuia care se găsește în documentația online, prin coordonate sau altele. Având la dispoziție coordonatele oferite de Geolocation, apelarea API-ului se va face prin coordonatele de latitudine și longitudine.
Răspunsul de la API poate veni sub diferite forme: json, xml sau html. S-a ales varianta de afișare a răspunsului sub formă de json, iar o parte din parametrii pe care acesta îi conține sunt:
	Coordonatele locației (latitudine, longitudine)
	O mică descriere a vremii (Ex: few clouds)
	Temperatura, temperatura resimțită
	Umiditatea
	Viteza vântului 
	Volumul de apă sau de zăpadă, dacă este cazul.
Un exemplu de apelare de API OpenWeather după denumirea orașului căutat este: https://api.openweathermap.org/data/2.5/weather?q=Bucharest&appid=${APIKEY}, unde APIKEY este cheia primită în urma conectării. 

## Descriere arhitectura:

### Ex de req, response

```json
{
    "ex":"test"
}
```
