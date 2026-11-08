using System.Runtime.InteropServices.JavaScript;

// The page loads this module and calls the exports; Main has nothing to do.
public static partial class Program
{
    public static void Main() { }

    [JSExport]
    public static string Mix(string recipeJson) => CreatureLab.Mixer.Mix(recipeJson);

    [JSExport]
    public static string Catalog() => CreatureLab.Mixer.Catalog();
}
