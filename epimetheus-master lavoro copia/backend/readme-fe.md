# Readme pre-separazione FE-BE 
## Avvio del progetto
Dopo la configurazione generale del progetto, eseguire nella cartella del progetto il comando <code>python main.py</code>,
e collegarsi all'url http://127.0.0.1:5000

# Frontend
Le cartelle del progetto frontend sono:
1. "templates" in cui sono presenti i file html del progetto;
2. "static" che contiene le immagini, il file di stile css e i javascript per la parte logica del frontend;

Il frontend è organizzato in due pagine:
1. form di compilazione, corrispondente a index.html per la parte template, e script.js per la parte di logica;
2. pagina dei risultati, corrispondente a results.html per la parte template, e results.js per la parte di logica;

Nel progetto sono state utilizzate le librerie bootstrap [versione 5.1.3](https://getbootstrap.com/docs/5.1/getting-started/introduction/) (per un supporto alla gestione degli elementi di stile) e [d3js v7](https://d3js.org/) (libreria per la creazione di visualizzazioni),
i cui link d'integrazione sono presenti negli head dei file html del progetto.

Per inviare i dati del form al backend e ricevere i dati di risposta, è stato collegato a una chiamata che viene scatenata al submit del form, attraverso la funzione goToResults().
In questa funzione prima viene fatto il controllo di validazione dei dati del form, poi vengono presi e salvati i dati in sessionStorage per:
- 'dataEl' : i dati ricavati dalla chiamata;
- 'score' : il tipo di score selezionato nel form di compilazione, per gestire i controlli nella pagina dei risultati;
- 'dataPreop' : i dati pre-operatori ricavati dal form di compilazione, utili per l'impostazione di alcuni parametri nella pagina dei risultati.

#### Results.js
Al load della pagina dei risultati viene chiamata la funzione createCounterfactual() in cui vengono passati i dati del predictionsR e il tipo di score.
In questa funzione vengono generati i valori presenti nelle due select per la gestione dinamica dei dati.
Nelle funzioni newResultsP e newResultsM viene creato l'oggetto(objOfPatient) con i dati per creare le varie visualizzazioni.
La funzione getResults(), recupera l'oggetto strutturato nella chiamata precedente, e genera le varie visualizzazioni:
- Lo scatterplot con id="scatterPlot1" ( che per problemi legati a dati errati ricevuti dal backend è stato nascosto con un d-none nell'html);
- Il violinplot viene creato nella funzione violinPlots() seguita dalla funzione plotWithBoxPlot() che va a creare i due box con gradiente che si sovrappongono ai due violin plots nella visualizzazione;
- Per il grafico con gradiente viene applicata una backgroundPositionX all'elemento con id="circleGradient" ottenuta facendo un calcolo percentuale della posizione di predictionC_6M;
- Per il grafico con la barra invece la stessa formula viene applicata per definire la posizione sull'asse delle x della barra all'interno della visualizzazione.

### Collegamenti al backend
Le funzioni che controllano la visualizzazione dei template html sono gestite nelle funzioni
homepage() e results() del file main.py
La chiamata per ricevere i risultati viene invece gestita nella funzione output()

### Note:
> Nel progetto sono stati gestiti solo i dati dei risultati delle procedure hip e knee;
> Nel form di compilazione la scelta di "Insert batch data" non è stata gestita.

