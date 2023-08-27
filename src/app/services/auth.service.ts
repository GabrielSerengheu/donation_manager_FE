import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

  private apiUrl = 'http://localhost:8080';

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuthenticated());

  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  public username = '';

  private failedLogins = 0;

  constructor(private http: HttpClient) {
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    return !!accessToken;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/auth/login", credentials, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response.loginCount === -1) {
            sessionStorage.setItem("changedPassword", String(false));
            window.location.href = '/change-password';
          } else if (response.message === "account is inactive") {
            alert("Account is inactive");
          } else {
            sessionStorage.setItem("changedPassword", String(true));
            this.isLoggedInSubject.next(true);
          }
        }),
        catchError(error => {
          this.failedLogins++;
          if (this.failedLogins >= 5){
            alert("Your account has been deactivated, because you entered the wrong password for 5 times")
          }
          return throwError(error);
        })
      );
  }



  logout(): Observable<any> {
    const token = this.getAccessToken();
    // const username = this.username;

    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.isLoggedInSubject.next(false);

    return this.http.post(`${this.apiUrl}/auth/logout`, {  }, { headers, responseType: 'text' });
  }

  getUsernameFromToken(token: string): Observable<string> {
    const url = `${this.apiUrl}/auth/get-username?token=${token}`;
    return this.http.get<string>(url);
  }

  saveAccessToken(accessToken: string): void {
    sessionStorage.setItem('accessToken', accessToken);
  }

  getAccessToken(): string | null {
    const token = sessionStorage.getItem('accessToken');
    return token ? token.trim() : null;
  }

  // Clear the accessToken from localStorage on logout
  clearAccessToken(): void {
    sessionStorage.removeItem('accessToken');
  }

  changePassword(newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/auth/change-password`;
    const requestBody = { newPassword };

    const token = this.getAccessToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    sessionStorage.setItem('changedPassword', String(true));
    return this.http.post(url, requestBody, { headers });
  }

  updateUserLoginCount(newLoginCount: number): Observable<any> {
    const url = `${this.apiUrl}/auth/update-login-count`;
    const requestBody = { newLoginCount };

    const token = this.getAccessToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(url, requestBody, { headers });
  }

  ngOnInit(): void {
    const token = this.getAccessToken(); // Get the token from your authentication service
    if (token) {
      this.getUsernameFromToken(token).subscribe(
        (username: string) => {
          this.username = username;
        },
        (error) => {
          console.error('Error fetching username:', error);
        }
      );
    }
  }
}
