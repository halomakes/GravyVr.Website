using Microsoft.AspNetCore.Mvc.Testing;

public partial class Program
{
    private static readonly Lazy<string> RootDirectory = new(() => AppDomain.CurrentDomain.BaseDirectory);
    private const string OutputDirectory = "wwwroot";

    public static async Task Main(string[] args)
    {
        var resources = new string[]
        {
            "css/site.css",
            "css/installation.css",
            "images/icon-summoner.png",
            "images/installation.jpg",
            "js/app.js",
            "favicon.ico"
        };
        var pages = new string[]
        {
            "",
            "Venues",
            "Installation",
            "Tooling",
            "404"
        };

        var factory = new WebApplicationFactory<GravyVr.Website.Program>();
        using var client = factory.CreateClient();

        foreach (var resource in resources)
            await StoreResource(client, resource, resource);
        foreach (var page in pages)
            await StoreResource(client, page, string.IsNullOrEmpty(page) ? "index.html" : $"{page}/index.html");
        await StoreResource(client, "404", "404.html");
    }

    private static async Task StoreResource(HttpClient client, string fetchUrl, string filePath)
    {
        var content = await client.GetStreamAsync(fetchUrl);
        Console.WriteLine($"Storing content from {fetchUrl} to {filePath}");
        await using var memoryStream = new MemoryStream();
        await content.CopyToAsync(memoryStream); // might need to read this multiple times
        await WriteFileAsync(filePath, memoryStream);
        if (filePath.Any(char.IsUpper)) // workaround case-sensitive gh-pages hosting
            await WriteFileAsync(filePath.ToLower(), memoryStream);
    }

    private static async Task WriteFileAsync(string filePath, Stream content)
    {
        var fullPath = Path.Combine(RootDirectory.Value, OutputDirectory, filePath);
        EnsureDirectoryExists(fullPath);
        content.Seek(default, SeekOrigin.Begin);
        var file = new FileStream(fullPath, FileMode.Create);
        await content.CopyToAsync(file);
        file.Close();
    }

    private static void EnsureDirectoryExists(string path)
    {
        var directory = Path.GetDirectoryName(path); // get directory if it's a file path
        if (directory is not null && !Directory.Exists(directory))
        {
            Console.WriteLine($"Creating directory {directory}...");
            Directory.CreateDirectory(directory);
        }
    }
}