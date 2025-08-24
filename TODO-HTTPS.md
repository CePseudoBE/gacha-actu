# 🔒 TODO : Migration vers HTTPS

## Quand tu passeras en HTTPS avec un domaine

### 1. **NextAuth Configuration** 
Fichier : `src/app/api/auth/[...nextauth]/route.ts`

```ts
// Remettre la configuration sécurisée
cookies: {
  sessionToken: {
    name: process.env.NODE_ENV === 'production' 
      ? `__Secure-next-auth.session-token`  // ✅ Remettre __Secure-
      : `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'  // ✅ Remettre true
    }
  }
}
```

### 2. **Variables d'environnement**
Fichier : `.env`

```env
# ✅ Passer toutes les URLs en HTTPS
NEXTAUTH_URL=https://tondomaine.com
NEXT_PUBLIC_APP_URL=https://tondomaine.com
ALLOWED_ORIGINS=https://tondomaine.com
```

### 3. **Configuration Nginx SSL**
Fichier : `nginx/nginx.conf`

- [ ] Ajouter les certificats SSL
- [ ] Configurer la redirection HTTP → HTTPS
- [ ] Mettre à jour les volumes SSL dans `docker-compose.yml`

### 4. **Docker Compose**
Fichier : `docker-compose.yml`

```yaml
# ✅ Vérifier que les volumes SSL sont mappés
volumes:
  - ./nginx/ssl:/etc/nginx/ssl:ro
```

### 5. **Test de sécurité**
- [ ] Vérifier que les cookies sont bien `Secure`
- [ ] Tester la connexion/déconnexion
- [ ] Valider que les redirections HTTPS fonctionnent

---
**Note** : Ne pas supprimer ce fichier, il servira de checklist pour la migration HTTPS !