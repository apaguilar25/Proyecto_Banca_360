# Banca 360 - Estructura Maven

## Estructura
```
banca360/
├── pom.xml
└── src/main/
    ├── java/com/banca360/      (para futuros servlets/clases Java)
    └── webapp/
        ├── WEB-INF/web.xml
        ├── css/
        ├── js/
        ├── login.html
        ├── dashboard.html
        └── ... (resto de HTML)
```

## Compilar
```
mvn clean package
```
Genera `target/banca360.war` desplegable en Tomcat/Jetty.

## Ejecutar en desarrollo
Despliega el WAR en un servidor compatible con Jakarta EE 10 (Tomcat 10+).
