/**
 * @param {string | URL} url
 * @returns {Promise<HTMLTemplateElement>}
 */
export async function loadHTMLTemplate(url) {
    const response = await fetch(url);
    const text = await response.text();
    const template = document.createElement("template");
    template.innerHTML = text;
    return template;
}
