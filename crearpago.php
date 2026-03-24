<?php
require_once __DIR__ . '/stripe-php-19.0.0/init.php';

\Stripe\Stripe::setApiKey('sk_test_51SZ9EmEnTCU0Dz6YQPFgM87LOAhJzp0p4UGSzK7s91xGONcr0Fuls6TLILgrTVePMJwLxpMpppnqMQLRKcmZ7Yly00Lf2ZySAU'); // Reemplaza con tu Secret Key

// Crear sesión de pago
$session = \Stripe\Checkout\Session::create([
    'payment_method_types' => ['card', 'link'], // todos los métodos habilitados
    'line_items' => [[
        'price_data' => [
            'currency' => 'eur',
            'unit_amount' => 5000, // 50 € (en céntimos)
            'product_data' => ['name' => 'Reserva Casa Cueva Las Palomas'],
        ],
        'quantity' => 1
    ]],
    'mode' => 'payment',
    'success_url' => 'https://tusitio.com/success.php',
    'cancel_url' => 'https://tusitio.com/cancel.php',
]);

// Devolver JSON con ID de sesión
header('Content-Type: application/json');
echo json_encode(['id' => $session->id]);
