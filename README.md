# CS452 Assignment 2: XML, REST and SOAP web services

Code for all four tasks of CS452 (University of Crete, winter 2026-27), Assignment 2. Each task is
its own Maven project, and the root `pom.xml` builds them all:

```bash
mvn verify          # build every module and run its tests (24 tests)
```

Needs Java 17 or newer and Maven 3.9. The dataset is `data/xmldata_mondial-3.0.xml`.

| Folder | Task | Framework |
| --- | --- | --- |
| `task-a-jaxp` | A: parse Mondial with JAXP, XPath queries, JSON with Gson | JAXP, Gson |
| `task-b1-country-service` | B.i: country and river REST service with Swagger | Spring Boot, springdoc (OpenAPI 3) |
| `task-b2-spotlight-client` | B.ii: web page that links text to DBpedia | Spring Boot, DBpedia Spotlight |
| `task-c1-jersey-converter` | C.i: cm/inch REST service | Jersey on Grizzly |
| `task-c2-weather-client` | C.ii: OpenWeatherMap client, XML output | Jersey client |
| `task-d-axis2` | D (bonus): two SOAP services and two clients | Apache Axis2 1.8 |

---

## A. JAXP, XPath and Gson

```bash
cd task-a-jaxp && mvn -q compile exec:java
```

`MondialXml` prints:

1. **A.i** The root node (`mondial`) and the first-level node names below it, with a count of each:
   `continent (5), country (231), organization (168), mountain (88), desert (30), island (184),
   river (135), sea (22), lake (92)`.
2. **A.ii** The 51 European countries. The XPath query is
   `/mondial/country[encompassed/@continent = /mondial/continent[@name='Europe']/@id]/@name`.
3. **A.iii** The countries in both Europe and Asia (Russia and Turkey), with every attribute,
   read with `getAttributes()`.
4. **A.iv** `european_countries.json`, which lists all 51 European countries with every attribute.
   It is written with Gson from a list of `LinkedHashMap`s.

## B.i Country and river service (Spring Boot)

```bash
cd task-b1-country-service && mvn -q package && java -jar target/country-service.jar
```

The service runs on port 5000, the port Elastic Beanstalk forwards to. Swagger UI is at
<http://localhost:5000/swagger-ui.html>, and the OpenAPI 3 document is at `/v3/api-docs`.

| Operation | Request | Example answer |
| --- | --- | --- |
| country_name | `GET /countries/GR/country_name` | `{"code":"GR","country_name":"Greece"}` |
| country_population | `GET /countries/GR/country_population` | `{"code":"GR","country_population":10538594}` |
| country_total_area | `GET /countries/GR/country_total_area` | `{"code":"GR","country_total_area":131940}` |
| country_capital_name | `GET /countries/GR/country_capital_name` | `{"code":"GR","country_capital_name":"Athens"}` |
| country_political_system | `GET /countries/GR/country_political_system` | `{"code":"GR","country_political_system":"parliamentary republic"}` |
| river_passes_through_countries | `GET /rivers/Nile/river_passes_through_countries` | `{"river":"Nile","river_passes_through_countries":["Egypt","Sudan"]}` |
| river_outfall | `GET /rivers/Nile/river_outfall` | `{"river":"Nile","river_outfall":[{"type":"sea","name":"Mediterranean Sea"}]}` |

Notes on the dataset:

- The two-letter code is the country's `datacode` attribute. Most codes match the usual ones, but
  not all: Russia is `RS`, Turkey `TU`, Austria `AU`. Serbia and Montenegro has no code.
- Codes and river names are case-insensitive. An unknown code or river returns 404 with a message.
- 59 of the 135 rivers list no countries (the Thames, for example), so their country list is empty.
- `river_outfall` returns a list, because the Rhein has two outfalls (North Sea and Bodensee).
- River names are as written in the dataset, often in German: `Donau`, `Rhein`, `Weichsel`.

## B.ii DBpedia Spotlight annotator (Spring Boot)

```bash
cd task-b2-spotlight-client && mvn -q package && java -jar target/spotlight-client.jar
```

Open <http://localhost:5000/>, type some text and press **Annotate**. The page posts the text to
`POST /api/annotate`. The server then calls `https://api.dbpedia-spotlight.org/en/annotate` with
`Accept: application/json` and builds the HTML. Every term Spotlight finds becomes a link to its
DBpedia resource. For example, *Leonardo da Vinci created the 'Mona Lisa'* becomes
[Leonardo da Vinci](http://dbpedia.org/resource/Leonardo_da_Vinci) created the
'[Mona Lisa](http://dbpedia.org/resource/Mona_Lisa)'.

The server HTML-escapes all text and only links `http(s)` URIs. If Spotlight is unreachable, the
page shows a 502 error. To use another Spotlight server, set `SPOTLIGHT_URL`.

## Deploying B.i and B.ii to AWS Elastic Beanstalk

Each Spring Boot app builds into one self-contained jar (`target/country-service.jar`,
`target/spotlight-client.jar`). The Mondial XML is packed inside the country-service jar. For each
app:

1. In the Elastic Beanstalk console, choose **Create application**. For the platform, pick
   **Java**, branch **Corretto 17** (or 21) on Amazon Linux 2023.
2. Under **Application code**, choose **Upload your code** and upload the jar.
3. Create the environment. The platform's nginx forwards port 80 to 5000, which is the port the
   apps listen on (`server.port=${PORT:5000}`).
4. Open the environment URL. For B.i, add `/swagger-ui.html`. For B.ii, the page is at `/`.

With the EB CLI, the equivalent is to run `eb init` (choose the Java / Corretto platform when
asked), add `deploy: artifact: target/<name>.jar` to `.elasticbeanstalk/config.yml`, then run
`eb create`.

## C.i Jersey converter

```bash
cd task-c1-jersey-converter && mvn -q compile exec:java
```

```
GET http://localhost:8080/api/converter/inch_to_cm?value=1      -> 2.54
GET http://localhost:8080/api/converter/cm_to_inch?value=2.54   -> 1.0
```

Answers are plain text by default. Send `Accept: application/json` or `Accept: application/xml`
for `{"inch":1.0,"cm":2.54}` or `<inch_to_cm><inch>1.0</inch><cm>2.54</cm></inch_to_cm>`. A
missing, non-numeric or infinite value returns 400.

## C.ii OpenWeatherMap client (Jersey)

You need a free key from <https://home.openweathermap.org/api_keys>. A new key can take a few hours
to start working.

```bash
cd task-c2-weather-client
OPENWEATHER_API_KEY=your-key mvn -q compile exec:java                      # Heraklion,GR
OPENWEATHER_API_KEY=your-key mvn -q compile exec:java -Dexec.args="Athens,GR"
```

The client calls `GET https://api.openweathermap.org/data/2.5/weather?q=<city>&mode=xml&units=metric&appid=<key>`.
It prints the XML answer, indented, followed by a short summary. The key is read only from the
environment, so it stays out of the code and the report.

## D. (bonus) Axis2 SOAP services

`mvn package` builds `target/hy452ws.aar`. That one archive holds both services
(`META-INF/services.xml` is a service group), so they deploy on the same server.

- **ws1 `ConverterService`**: operations `inch_to_cm` and `cm_to_inch`.
- **ws2 `IdealWeightService`**: operation `idealWeightFormula(heightCm)` returns an `IdealWeight`
  with `menWeight` and `womenWeight`, from the Miller formula. The same calculation is also
  available as `millerFormula`, because the assignment's example response is
  `millerFormulaResponse`.

The package `hy452.ws.intro` gives the namespaces `http://intro.ws.hy452` and
`http://intro.ws.hy452/xsd`, as in the example. With 175 cm, the response is:

```xml
<ns:millerFormulaResponse xmlns:ns="http://intro.ws.hy452"><ns:return xmlns:ax21="http://intro.ws.hy452/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ax21:IdealWeight"><ax21:menWeight>68.745475</ax21:menWeight><ax21:womenWeight>65.2006</ax21:womenWeight></ns:return></ns:millerFormulaResponse>
```

The example's numbers come from converting with 0.3937 inch/cm, so ws2 uses that factor. The exact
factor (1/2.54) would give 68.745669 and 65.200787 kg. ws1 uses the exact 2.54 cm/inch.

**On Tomcat (as in the lab):** deploy `axis2.war` (Axis2 1.8.2) on Tomcat 9, for example from
Eclipse with the Axis2 facet. Then copy `target/hy452ws.aar` into
`webapps/axis2/WEB-INF/services/` and check <http://localhost:8080/axis2/services/listServices>.

**Without Tomcat:** `mvn -q compile exec:java` serves both services on Axis2's built-in HTTP server,
at the same `http://localhost:8080/axis2/services/...` URLs.

**Clients** (the endpoint defaults to Tomcat's `localhost:8080`):

```bash
CP=$(mvn -q dependency:build-classpath -Dmdep.outputFile=/dev/stdout):target/classes
java -cp "$CP" hy452.ws.intro.ConverterClient
java -cp "$CP" hy452.ws.intro.IdealWeightClient http://localhost:8080/axis2/services/IdealWeightService 175
```

Each client prints the values it got back and the SOAP response body.
