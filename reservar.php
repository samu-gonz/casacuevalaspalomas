<?php
// ARCHIVO: reservar.php

function mostrarMensaje($mensaje, $esError = false) {
    // RUTA CORREGIDA: Asumimos que reserva.html está un nivel arriba (../)
    $url_volver = '../reserva.html'; 
    
    echo "<!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Resultado de Reserva</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; padding: 2rem; text-align: center; }
            .mensaje { padding: 1.5rem; border-radius: 8px; background-color: " . ($esError ? "#f8d7da" : "#d4edda") . "; color: " . ($esError ? "#721c24" : "#155724") . "; max-width: 600px; margin: 2rem auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .btn { display: inline-block; margin-top: 1.5rem; padding: 0.6rem 1.2rem; border: none; border-radius: 6px; font-size: 1rem; text-decoration: none; color: white; background-color: #007bff; cursor: pointer; }
            .btn:hover { background-color: #0056b3; }
        </style>
    </head>
    <body>
        <div class='mensaje'>
            <p>$mensaje</p>
            <a class='btn' href='$url_volver'>Volver al Calendario de Reserva</a>
        </div>
    </body>
    </html>";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    mostrarMensaje("Acceso no permitido.", true);
}

$nombre = trim($_POST['nombre'] ?? '');
$email = trim($_POST['email'] ?? '');
$fecha = trim($_POST['fecha'] ?? '');
$casa = $_POST['casa'] ?? '';

if (!$nombre || !$email || !$fecha || !$casa) {
    mostrarMensaje("Todos los campos son obligatorios.", true);
}

// Procesa el formato de rango enviado por Flatpickr
$fechas = explode(' to ', $fecha);
if(count($fechas) == 1) $fechas = explode(' - ', $fecha);

$fecha_inicio_str = $fechas[0];
$fecha_fin_str = $fechas[1] ?? $fechas[0];

try {
    $inicio = new DateTime($fecha_inicio_str);
    $fin = new DateTime($fecha_fin_str);
    if ($inicio > $fin) mostrarMensaje("La fecha de inicio no puede ser posterior a la fecha de fin.", true);
} catch (Exception $e) {
    mostrarMensaje("Fechas no válidas: " . $e->getMessage(), true);
}

$archivo = __DIR__ . '/reservas.json';

if (!file_exists($archivo)) {
    file_put_contents($archivo, "[]");
}

$reservas = json_decode(file_get_contents($archivo), true);
if (!is_array($reservas)) $reservas = [];

// Chequeo de superposición (lógica de disponibilidad)
foreach($reservas as $r) {
    if ($r['casa'] !== $casa) continue;

    try {
        $r_inicio = new DateTime($r['fecha_inicio']);
        $r_fin = new DateTime($r['fecha_fin']);

        if ($inicio <= $r_fin && $fin >= $r_inicio) {
            mostrarMensaje("Error: Las fechas seleccionadas se superponen con otra reserva.", true);
        }
    } catch (Exception $e) {
        // Ignoramos reservas mal formateadas
    }
}

// ⚠️ FORMATO ISO: GUARDAMOS SIEMPRE EN YYYY-MM-DD
$reservas[] = [
    'nombre' => $nombre,
    'email' => $email,
    'fecha_inicio' => $inicio->format('Y-m-d'), 
    'fecha_fin' => $fin->format('Y-m-d'),     
    'casa' => $casa
];

// Guardar el JSON
if (file_put_contents($archivo, json_encode($reservas, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
    mostrarMensaje("Error al guardar la reserva. Revisa permisos.", true);
}

mostrarMensaje("Reserva realizada correctamente. Se ha guardado en el sistema.");
?>