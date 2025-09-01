import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/app/home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'app',
    loadComponent: () => import('./features/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'search',
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent)
      },
      {
        path: 'album/:id',
        loadComponent: () => import('./features/album/album.component').then(m => m.AlbumComponent)
      },
      {
        path: 'artist/:id',
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/artist/artist.component').then(m => m.ArtistComponent)
      },
      {
        path: 'wishlist',
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent)
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'recommendation/:id',
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/get-recommendation/recommendation.component').then(m => m.GetRecommendationComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];