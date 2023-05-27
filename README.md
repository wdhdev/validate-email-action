# Validate Email Action
Check if an email address is valid.

## Example Usage
```yaml
- uses: wdhdev/email-validator@main
  with:
    email: "example@google.com"
```

## Inputs

### `email` (Required)
The email address you want to check.

## Outputs

### result
The result of the tests.

Example:
```json
{
    "success": true,
    "email": "example@google.com",
    "test_results": {
        "matches_format": true,
        "mx_exists": true
    },
    "results": {
        "domain": "google.com",
        "mx_records": [
            {
                "exchange": "smtp.google.com",
                "priority": 10
            }
        ]
    }
}
```
