# Condense an Outscraper Google Maps export into a GHL contact-import CSV for cold calls.
# Usage: python3 outscraper-to-ghl.py export.xlsx out.csv
import sys, re, pandas as pd
src, out = sys.argv[1], sys.argv[2]
df = pd.read_excel(src)
df = df[df.business_status != 'CLOSED_PERMANENTLY'].reset_index(drop=True)
df['trade'] = df['query'].str.split(',').str[0].str.strip()
GENERIC = {'contractor', 'service', 'services', 'company', 'store', 'firm', 'agency', 'supplier', 'shop', 'and', 'home'}
def has_trade_word(name, typ):
    # stem each meaningful word of the GBP category (first 4 letters) and look for it in the business name
    stems = [w[:4] for w in re.findall(r'[a-z]+', str(typ).lower()) if w not in GENERIC and len(w) > 2]
    return not stems or any(s in str(name).lower() for s in stems)

rows = []
for q, g in df.groupby('query', sort=False):
    top3 = g.head(3)['type'].mode()
    top_type = top3.iloc[0] if len(top3) else None
    for i, r in g.iterrows():
        # top competitor = most-reviewed business with the same category in the same search; blank if none
        same = g[(g.place_id != r.place_id) & (g.type == r.type) & g.reviews.notna()]
        c = same.sort_values('reviews', ascending=False).iloc[0] if len(same) else None
        subs = [s.strip() for s in str(r.subtypes).split(',')]
        if top_type and r.type != top_type and top_type in subs:
            hint = f"A: Category is '{r.type}', top 3 use '{top_type}'"
        elif not has_trade_word(r['name'], r.type):
            hint = f"B: Name missing trade keyword ({r.type})"
        else:
            hint = "C: Check Products/Services tabs"
        rows.append({
            'First Name': r.first_name if pd.notna(r.first_name) else '',
            'Last Name': r.last_name if pd.notna(r.last_name) else '',
            'Business Name': r['name'],
            'Phone': re.sub(r'[^\d+]', '', str(r.phone)) if pd.notna(r.phone) else '',
            'Email': r.email if pd.notna(r.email) else '',
            'City': r.city,
            'Postal Code': r.postal_code,
            'Website': r.website if pd.notna(r.website) else '',
            'Trade': r.type if pd.notna(r.type) else r.trade,
            'Google Rating': r.rating if pd.notna(r.rating) else '',
            'Google Reviews': int(r.reviews) if pd.notna(r.reviews) else 0,
            'Top Competitor': f"{c['name']} ({int(c.reviews)} reviews)" if c is not None else '',
            'Freebie Hint': hint,
            'Google Maps Link': r.location_link,
            'Tags': f"cold call,{r.trade}",
            '_pid': r.place_id,
        })
o = pd.DataFrame(rows)
o = o[o.Phone != ''].drop_duplicates('_pid').drop_duplicates('Phone').drop(columns='_pid')
o = o.sort_values('Google Reviews')  # fewest reviews first = strongest hook
assert has_trade_word('Steve Roofing', 'Roofing contractor') and not has_trade_word('Steve Pty Ltd', 'Roofing contractor')
assert o.Phone.is_unique and (o.Phone.str.startswith('+61')).all()
o.to_csv(out, index=False)
print(len(o)); print(o['Freebie Hint'].str[0].value_counts()); print(o.Trade.value_counts())
print(o.head(8).to_string())
