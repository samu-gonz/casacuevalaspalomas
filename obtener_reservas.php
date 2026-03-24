<?php
// ARCHIVO: obtener_reservas.php

// Esto asegura que el navegador no guarde datos viejos en memoria (caché)
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');

$archivo = __DIR__ . '/reservas.json';

// Si el archivo existe, lo leemos y lo enviamos
if (file_exists($archivo)) {
    echo file_get_contents($archivo);
} else {
    // Si no existe, devolvemos un array vacío
    echo json_encode([]);
}
?>