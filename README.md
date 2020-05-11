# Weather and Air Quality

Intro

## Descrierea aplicației

	De cele mai multe ori, trăind, poate, și într-un oraș aglomerat de mașini care circulă la orice oră și ticsit de fabrici și uzine, pe lângă datele meteorologice pe care le dorim să le aflăm zilnic, cantitatea poluării aerului ar fi o altă informație importantă de reținut înainte de a ieși din casă.
	Prezenta aplicație înregistrează locația curentă folosirii și oferă astfel de informații despre vreme și calitatea aerului, mai exact nivelul de Dioxid de Azot, din respectiva locație. 
	Pentru aceasta a fost nevoie să folosesc Geolocation API care permite utilizatorilor să își vadă locația prin coordonatele latitudine și longitudine, doar dacă aceștia își oderă acordul. Pentru accessarea informațiilor despre vreme, am folosit API-ul de la OpenWeather, iar datele despre calitatea aerului sunt oferite de OpenAQ.  Integrând toate acestea într-o singură aplicație, a fost posibilă vizualizarea tuturor informațiilor într-o singură pagină Web.


## Prezentare API-urilor
### GEOLOCATION API
	API-ul de geolocalizare permite utilizatorului să-și ofere locația aplicațiilor web, dacă dorește acest lucru. Acest API este accesat printr-un apel la navigator.geolocation care va determina browser-ul utilizatorului să le ceară permisiunea de a accesa datele locației sale. Dacă acceptă, browserul va folosi cea mai bună funcționalitate disponibilă pe dispozitiv pentru a accesa aceste informații (de exemplu, GPS).
	Eu am accesat această locație prin Geolocation.getCurrentPosition() care returnează locația curentă a device-ului de pe care este folosit. Aceasta inițiază o solicitare asincronă pentru a detecta poziția utilizatorului și solicită hardware-ul de poziționare pentru a obține informații actualizate. Când poziția este determinată, funcția de apelare definită este executată.
	O instanță GeolocationPosition este returnată printr-un apel la una dintre metodele conținute în Geolocation și conține un timestamp plus o instanță a obiectului GeolocationCoordinates. Am optat pentru returnarea latitudinii și longitudinii pentru a putea fi folosite mai departe și în accesarea informațiilor despre vreme și poluarea aerului.
### OPEN WEATHER
	Printr-un OpenWeather API se pot accesa datele meteo curente pentru peste 200.000 de orașe. Acesta este disponibil printr-un API key pe care l-am primit în urma creării unui cont. Metodele de apelare ale unui API sunt multiple: cu ajutorului numelui orașului, al id-ului acestuia care se găsește în documentația online, prin coordonate sau altele. Având la dispoziție coordonatele oferite de Geolocation, apelarea API-ului se va face prin coordonatele de latitudine și longitudine.
	Răspunsul de la API poate veni sub diferite forme: json, xml sau html. S-a ales varianta de afișare a răspunsului sub formă de json, iar o parte din parametrii pe care acesta îi conține sunt:
	Coordonatele locației (latitudine, longitudine)
	O mică descriere a vremii (Ex: few clouds)
	Temperatura, temperatura resimțită
	Umiditatea
	Viteza vântului 
	Volumul de apă sau de zăpadă, dacă este cazul.
	Un exemplu de apelare de API OpenWeather după denumirea orașului căutat este: https://api.openweathermap.org/data/2.5/weather?q=Bucharest&appid=${APIKEY}, unde APIKEY este cheia primită în urma conectării. 
	URL-ul pe care l-am folosit în realizare aplicației este: https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric, latitudinea și longitudinea fiind primite ca parametru din geolocație, iar ultimul parametru units=metric a fost adăugat pentru a converti temperatura din Kelvin (default) în grade Celsius.
	
### OPENAQ
	Paltforma Open AQ API oferă date despre calitatea aerului din numeroase orașe. API-urile sunt publice, așadar nu necesită niciun tip de autentificare. Folosind endpoint-ul /measurements  se pot apela informațiile cu ajutorul coordonatelor locației dorite. Mai sunt și alte modalități de apelare, precum id-ul sau denumirea locației. 
	Răspunsul în urma cererii de la API vine sub formă de JSON și conține:
	Denumirea locației și țara
	Parametrul găsit în analiza poluării (〖NO〗_2), Valuarea acestuia și Unitatea de măsură
	Ultima dată când s-au prelucrat datele
	Sursa acestor informații
	URL-ul folosit în aplicație este https://api.openaq.org/v1/latest?coordinates=${lat},${lon}, unde de asemenea primește parametrii latitudine și longitudine.
## Descriere arhitectura:
	După găsirea API-urilor potrivite, primul pas a fost crearea unui  server web cu ajutorul NodeJS și al framework-ului ExpressJS. Datele vor fi stocate într-o bază de date, iar accesul la acestea se face prin Sequelize.
	După inițializarea unei aplicații NodeJS, s-a început efectiv construirea serverului prin intermediul ExpressJs și s-a specificat portul pe care serverul va primi cereri HTTP.
	În continuare, s-a implementat Geolocation API-ul care accesează locația curentă și înregistrează latitudinea și longitudinea. Pentru a fi afișate în pagină, le-am apelat calea din JSON. Codul poate fi urmărit mai jos:
	
![image](https://user-images.githubusercontent.com/64913985/81583994-d3830280-93ba-11ea-8b42-57e6191108f8.png)
	
	Următorul pas a fost realizarea comunicării dintre client și server. Astfel, pentru a folosi coordonatele locației, a fost nevoie ca acestea să fie transmise către server și salvate ulterior într-o bază de date. Pentru aceasta s-a realizat o metodă HTTP POST care ajută serverul să primească informațiile. Endpoint-ul definit este /api. 
	Fiecare endpoint din API-ul REST este definită de metoda HTTP și numele resursei la care se referă. Clientul va trimite datele prin cererea HTTP în format JSON. Datele se for accesa și manipula cu ajutorul metodei fetch() .
![image](https://user-images.githubusercontent.com/64913985/81584294-3bd1e400-93bb-11ea-928f-8caf353ab791.png)
	
	Pentru a memora latitudinea și longitudinea într-o bază de date a serverului, s-a folosit NeDB, un subset al MangoDB. Pentru aceasta nu s-a folosit autentificare. Astfel, de fiecare dată când se vor trimite informațiile către server, prin apăsare unui buton de Submit din interfața aplicației, latitudinea și longitudinea locației curente vor fi salvate într-un fișier denumit database.db.
![image](https://user-images.githubusercontent.com/64913985/81584343-4db38700-93bb-11ea-9bab-beee86b0bba8.png)
![image](https://user-images.githubusercontent.com/64913985/81584384-5906b280-93bb-11ea-8a8f-b5ffbf9c842b.png)
	
	Având aceste elemente funcționale, a mai rămas doar integrarea cu API-urile descrise anterior. După obținerea unui API Key pentru Open Weather și revizuirea documentației acestuia, s-a trecut la implementare.
	Pentru a accesa endpoint-ul /weather al API-ului în scriptul client-side s-a creat un “request” către acesta, răspunsul fiind obținut prin metoda fetch() și s-a transpus în formă de JSON.
![image](https://user-images.githubusercontent.com/64913985/81584421-67ed6500-93bb-11ea-8485-7e57acfa5865.png)
	
	URL-ul conține ca parametrii cheia API, latitudinea și longitudinea dar și unitatea de măsură pentru afișarea temperaturii. Informațiile generate de apelarea API-ului au fost scoase din JSON și afișate. 
	Pentru a trimite latitudinea și longitudinea de la client, către server, pentru ca acesta să le poată transmite către Open Weather și să primească informații despre vreme ca mai apoi să le transmită către client s-a creat un nou endpoint.
	
	Având și această bucată funcțională, a mai rămas doar accesarea API-ului Open AQ, pe același principiu.
![image](https://user-images.githubusercontent.com/64913985/81585099-52c50600-93bc-11ea-80d9-1482b65857be.png)
	
	A fost nevoie, din cauza erorilor CORS, să creez un alt endpoint în server care primește latitudinea și longitudinea iar apoi le trimite mai departe.
![image](https://user-images.githubusercontent.com/64913985/81585545-fdd5bf80-93bc-11ea-988f-bc41cad0989d.png)

	La final, în consola aplicației se va observa conținutul celor două jsoane.
![image](https://user-images.githubusercontent.com/64913985/81586076-b4d23b00-93bd-11ea-874d-a99228bcd40a.png)

## REFERINTE
https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
https://docs.openaq.org/#api-Latest
https://openweathermap.org/current#name
http://expressjs.com/en/guide/routing.html
https://dbdb.io/db/nedb
