
export const htmlDownload = (data, file_name) => {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, "  ")], {type: "text/plain"})
    );
    a.download = file_name;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}