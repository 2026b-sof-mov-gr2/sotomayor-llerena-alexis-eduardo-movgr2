# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Las personas de la comunidad universitaria consultan puntos de carga disponibles en el campus. El personal administrador registra puntos, actualiza su estado y elimina reportes incorrectos.

## Product Purpose

VoltU permite localizar y mantener actualizada la disponibilidad de los puntos de carga del campus, para que las personas encuentren un punto útil antes de desplazarse.

## Operating Context

La consulta sucede desde un teléfono dentro del campus. La gestión se realiza desde la misma lista de puntos: crear, actualizar únicamente el estado de un punto existente y confirmar antes de eliminar.

## Capabilities and Constraints

- Recurso principal: punto de carga con edificio, piso, ubicación, descripción, estado, momento de actualización y un plano de puertos individuales.
- Estados válidos: Disponible, Ocupado y Dañado.
- La lista permite buscar por edificio o ubicación y filtrar por estado. Cada puerto se puede añadir, habilitar, deshabilitar y eliminar desde el plano de su edificio.
- La pestaña Mapa ubica los edificios con coordenadas de demostración y permite entrar al plano de puertos correspondiente.
- Este alcance asume que las operaciones CRUD son administrativas; es una inferencia documentada porque no hubo un mecanismo de entrevista disponible.

## Brand Commitments

Nombre: VoltU. Las referencias aportadas fijan una identidad azul eléctrico, verde de disponibilidad y lenguaje en español.

## Evidence on Hand

Referencias visuales aportadas por la persona usuaria: lista de puntos, confirmación de eliminación, registro y actualización de estado. Los datos de demostración están en `src/data/aulas.ts`.

## Product Principles

- Mostrar el estado del punto antes que los detalles secundarios.
- Hacer que cada acción CRUD tenga un resultado visible y reversible cuando sea posible.
- Mantener la consulta rápida y legible en movimiento.
- No permitir una eliminación accidental.
