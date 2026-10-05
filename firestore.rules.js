rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función para verificar si es admin
    function isAdmin() {
      return request.auth != null && exists(/databases/$(database)/documents/adminUsers/$(request.auth.token.email));
    }

    // Productos: Cualquiera puede leer activos, solo admin puede escribir
    match /products/{productId} {
      allow read: if resource.data.activo == true || isAdmin();
      allow write: if isAdmin();
    }

    // Banners: Cualquiera puede leer activos, solo admin puede escribir
    match /banners/{bannerId} {
      allow read: if resource.data.activo == true || isAdmin();
      allow write: if isAdmin();
    }

    // Pedidos (Orders)
    match /orders/{orderId} {
      // El cliente público solo puede leer si conoce el ID exacto (rastreo)
      // En un entorno real estricto, se valida con el teléfono/email asociado en una Cloud Function.
      // Para permitir la consulta de rastreo directa:
      allow get: if true; 
      allow list: if isAdmin();
      
      // La creación de pedidos se debe hacer mediante el Backend (Serverless Function) 
      // para validar precios, pero si se requiere desde el front por arquitectura base:
      allow create: if true; 
      
      allow update, delete: if isAdmin();
    }

    // Usuarios Administradores
    match /adminUsers/{email} {
      allow read: if request.auth != null && request.auth.token.email == email;
      allow write: if isAdmin();
    }
  }
}