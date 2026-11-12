# Instruções do projeto

## Objetivo

Este projeto é uma aplicação de notas com frontend em Next.js/React e backend em Node.js/Express.

## Estrutura

- `client/`: aplicação frontend.
- `server/`: API e modelos do backend.
- `client/src/app/components/Notes2.0/`: componentes relacionados às notas.
- `server/controllers/`: regras de acesso às notas.
- `server/model/`: modelos MongoDB.

## Regras

- Preservar o comportamento existente da aplicação.
- Não alterar o backend sem necessidade.
- Priorizar alterações pequenas e específicas.
- Não remover funcionalidades existentes.
- Verificar os testes disponíveis antes de considerar a alteração concluída.
- Não considerar uma alteração concluída apenas porque o código foi modificado.
- Quando a tarefa envolver a interface de notas, verificar o fluxo completo entre API, estado do frontend e componente visual.

## Critério de pronto

Uma alteração só está concluída quando:

1. O comportamento solicitado está implementado.
2. O comportamento existente continua funcionando.
3. Os testes disponíveis passam.
4. A documentação necessária foi atualizada.
5. A alteração pode ser revisada como um PR independente.