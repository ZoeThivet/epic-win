function warnAndInform() {

    function highlightExpression(target) {

        // ATTENTION RARETÉ -> une regex documentée 😏💕
        var regex = "(?<![a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ])" // Pour ne pas surligner tiramisu (qui contient "ami")
        + "(" + target + ")"
        + "(?!([^<]+)?>)" // Pour ne pas changer le texte à l'intérieur des balises HTML. Dans l'exemple ci-après, on veut seulement la deuxième occurrence de "connecté" : <p class='connecté'>connecté</p>
        + "(?![a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ·(])"; // Encore le tiramisu, et aussi pour éviter de surligner les textes ayant une forme féminisée sur la page web (exemples : utilisateur·trice, connecté(e))
        // Remarque/TODO : pour le moment, les caractères spéciaux des regex ne sont pas échappés (?.*! etc)
        // Cette page est cool https://www.regular-expressions.info/lookaround.html
        // Si besoin d'avoir la regex en un seul tenant (oui elle est longue) : (?<![a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ])(target)(?!([^<]+)?>)(?![a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ·(])
        
        var texteSurligne = '<span style="background-color:#FFEEAA">' + target + '</span>';
        document.body.innerHTML = document.body.innerHTML.replaceAll(new RegExp(regex, "gi"), texteSurligne);
    }

    function highlightExpressions(file) {
        fetch(file)
            .then(response => response.text())
            .then(text => text.split("\n"))
            .then(text => text.forEach(element => highlightExpression(element.split(",")[0])))
            .catch((error) => console.log("Impossible de lire le fichier " + file))
    }

    highlightExpressions(chrome.runtime.getURL("dictionary.csv")); // chrome.runtime.getURL est nécessaire pour naviguer dans les fichiers de l'extensions et non dans l'arborescence du site visité lui-même
    
}

chrome.action.onClicked.addListener((tab) => {
    if (!tab.url.includes("chrome://")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: warnAndInform
        });
    }
});