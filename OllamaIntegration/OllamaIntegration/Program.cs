using System;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Allow requests from React app
                  .AllowAnyMethod()  // Allow GET, POST, PUT, DELETE, etc.
                  .AllowAnyHeader()  // Allow all headers
                  .AllowCredentials(); // Allow cookies and authorization headers
        });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Use CORS policy
app.UseCors("AllowSpecificOrigin");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();



var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = new WeatherForecast[]
    {
        new WeatherForecast(DateOnly.FromDateTime(DateTime.Now), 27, "Mild"),
        new WeatherForecast(DateOnly.FromDateTime(DateTime.Now.AddDays(1)), 17, "Cool"),
        new WeatherForecast(DateOnly.FromDateTime(DateTime.Now.AddDays(2)), 33, "Hot"),
        new WeatherForecast(DateOnly.FromDateTime(DateTime.Now.AddDays(3)), 4, "Freezing"),
        new WeatherForecast(DateOnly.FromDateTime(DateTime.Now.AddDays(4)), 41, "Scorching")
    };

    return forecast;
})
.WithName("GetWeatherForecast");
app.Run();

internal record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
